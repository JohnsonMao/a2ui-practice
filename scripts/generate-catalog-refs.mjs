/**
 * generate-catalog-refs.mjs
 *
 * Reads registered component Impl names from src/catalog/index.ts,
 * loads their API schemas from @a2ui/web_core (no JSX required),
 * and writes one Markdown reference file per component to
 * skills/generate-ui/references/<ComponentName>.md.
 *
 * Run via: node scripts/generate-catalog-refs.mjs
 *
 * For custom components (APIs not in basic_catalog), this script logs a
 * warning and skips them. To include custom APIs, add them to
 * scripts/custom-catalog-apis.mjs (see bottom of this file for format).
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dir, '..')

// ---------------------------------------------------------------------------
// Step 1: Load all standard basic_catalog APIs (no JSX, plain JS)
// ---------------------------------------------------------------------------

const basicComponentsPath = resolve(
  root,
  'node_modules/@a2ui/web_core/src/v0_9/basic_catalog/components/basic_components.js',
)
const basicApis = await import(basicComponentsPath)
// Exports: TextApi, ButtonApi, ImageApi, …

// ---------------------------------------------------------------------------
// Step 2: Load any custom APIs (optional extension point)
// ---------------------------------------------------------------------------

const customApisPath = resolve(__dir, 'custom-catalog-apis.mjs')
let customApis = {}
if (existsSync(customApisPath)) {
  customApis = await import(customApisPath)
  console.log(`  📦 Loaded custom-catalog-apis.mjs`)
}

const allApis = { ...basicApis, ...customApis }

// ---------------------------------------------------------------------------
// Step 3: Parse src/catalog/index.ts to get the ordered Impl list
// ---------------------------------------------------------------------------

const catalogSrc = readFileSync(resolve(root, 'src/catalog/index.ts'), 'utf-8')

// Extract the array passed to `new Catalog<...>('custom', [ ... ])`
const catalogMatch = catalogSrc.match(/new Catalog[^(]*\([^,]+,\s*\[([^\]]+)\]/s)
if (!catalogMatch) {
  console.error('❌ Could not parse customCatalog from src/catalog/index.ts')
  process.exit(1)
}

const implNames = catalogMatch[1]
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

// ---------------------------------------------------------------------------
// Step 4: Resolve each Impl → Api
// ---------------------------------------------------------------------------

/** @type {Array<{ name: string, schema: import('zod').ZodTypeAny }>} */
const resolvedApis = []

for (const implName of implNames) {
  // Convention: FooImpl → FooApi
  const apiName = implName.replace(/Impl$/, 'Api')
  if (allApis[apiName]) {
    resolvedApis.push(allApis[apiName])
  } else {
    console.warn(`  ⚠ No API found for ${implName} (looked for ${apiName}) — skipped`)
  }
}

// ---------------------------------------------------------------------------
// Zod introspection helpers
// ---------------------------------------------------------------------------

/** Strip "REF:some/path|" prefix used by @a2ui/web_core descriptions. */
function cleanDescription(raw) {
  if (!raw) return '—'
  const cleaned = raw.replace(/^REF:[^|]+\|/, '').trim()
  // If only a REF remains with no human description, return '—'
  if (cleaned.startsWith('REF:')) return '—'
  return cleaned || '—'
}

/** Get description from a Zod field, traversing wrappers. */
function getDescription(zodType) {
  const raw = zodType.description ?? zodType._def?.description
  if (raw) return cleanDescription(raw)
  if (zodType._def?.innerType) return getDescription(zodType._def.innerType)
  return '—'
}

/** Resolve Zod type to { type, defaultVal, required }. */
function resolveZodType(zodType) {
  const tn = zodType._def?.typeName

  switch (tn) {
    case 'ZodOptional': {
      const inner = resolveZodType(zodType._def.innerType)
      return { ...inner, required: false }
    }
    case 'ZodNullable': {
      const inner = resolveZodType(zodType._def.innerType)
      return { ...inner, required: false }
    }
    case 'ZodDefault': {
      const inner = resolveZodType(zodType._def.innerType)
      const raw =
        typeof zodType._def.defaultValue === 'function'
          ? zodType._def.defaultValue()
          : zodType._def.defaultValue
      return { ...inner, defaultVal: JSON.stringify(raw), required: false }
    }
    case 'ZodString':
      return { type: 'string', defaultVal: '—', required: true }
    case 'ZodNumber':
      return { type: 'number', defaultVal: '—', required: true }
    case 'ZodBoolean':
      return { type: 'boolean', defaultVal: '—', required: true }
    case 'ZodEnum': {
      const values = zodType._def.values.map((v) => `"${v}"`).join(' | ')
      return { type: values, defaultVal: '—', required: true }
    }
    case 'ZodLiteral':
      return { type: `"${zodType._def.value}"`, defaultVal: '—', required: true }
    case 'ZodObject':
      return { type: 'object', defaultVal: '—', required: true }
    case 'ZodArray':
      return { type: 'array', defaultVal: '—', required: true }
    case 'ZodUnion': {
      const options = zodType._def.options
      const firstPrimitive = options.find((o) =>
        ['ZodString', 'ZodNumber', 'ZodBoolean'].includes(o._def?.typeName),
      )
      if (firstPrimitive) {
        const base = resolveZodType(firstPrimitive)
        return { ...base, type: `${base.type} | expression` }
      }
      // If all options are objects, collapse to 'object'
      const allObjects = options.every((o) => o._def?.typeName === 'ZodObject')
      if (allObjects) return { type: 'object', defaultVal: '—', required: true }
      const types = [...new Set(options.map((o) => resolveZodType(o).type))].join(' | ')
      return { type: types, defaultVal: '—', required: true }
    }
    default:
      return { type: 'unknown', defaultVal: '—', required: true }
  }
}

/** Extract all props from a Zod object schema. */
function extractProps(schema) {
  const shape = schema.shape ?? {}
  return Object.entries(shape).map(([propName, zodType]) => {
    const description = getDescription(zodType)
    const { type, defaultVal, required } = resolveZodType(zodType)
    return { name: propName, type, description, defaultVal, required }
  })
}

/** Prop names to skip in the JSON example (complex or rarely set). */
const EXAMPLE_SKIP_PROPS = new Set(['accessibility', 'checks', 'action'])

/** Generate an example value for a prop based on its name and type. */
function exampleValue(propName, type) {
  if (propName === 'child' || propName.endsWith('Id')) return '<component-id>'
  if (propName === 'children') return [{ id: '<child-id>' }]
  if (propName === 'tabs') return [{ title: 'Tab 1', child: '<content-id>' }]
  if (propName === 'options') return [{ label: 'Option A', value: 'a' }]
  if (propName === 'url') return 'https://example.com/...'
  if (propName === 'text') return 'Sample text'
  if (propName === 'label') return 'Label'
  if (propName === 'name') return 'star'
  if (propName === 'value' && type === 'boolean | expression') return false
  if (propName === 'value' && type === 'number | expression') return 50
  if (propName === 'trigger') return '<trigger-id>'
  if (propName === 'content') return '<content-id>'
  if (type.startsWith('"') && type.includes(' | ')) {
    return type.split(' | ')[0].replace(/"/g, '')
  }
  if (type === 'string' || type.startsWith('string')) return 'value'
  if (type === 'number' || type.startsWith('number')) return 0
  if (type === 'boolean' || type.startsWith('boolean')) return false
  if (type === 'array' || type.startsWith('array')) return []
  if (type === 'object') return {}
  return 'value'
}

// ---------------------------------------------------------------------------
// Markdown generation
// ---------------------------------------------------------------------------

function generateMarkdown(name, schema) {
  const props = extractProps(schema)

  // Props table
  const rows = props.map((p) => {
    const req = p.required ? '✓' : '—'
    const typeEscaped = p.type.replace(/\|/g, '\\|')
    return `| \`${p.name}\` | ${typeEscaped} | ${p.description} | ${p.defaultVal} | ${req} |`
  })

  const table =
    rows.length > 0
      ? `| Prop | Type | Description | Default | Required |\n` +
        `|------|------|-------------|---------|----------|\n` +
        rows.join('\n')
      : '_No props_'

  // JSON example — required props only (skip complex shared props)
  const requiredProps = props.filter((p) => p.required && !EXAMPLE_SKIP_PROPS.has(p.name))
  const optionalProps = props.filter((p) => !p.required)

  const exampleObj = {
    id: `my-${name.toLowerCase()}`,
    component: name,
  }
  for (const p of requiredProps) {
    exampleObj[p.name] = exampleValue(p.name, p.type)
  }

  const optionalNote =
    optionalProps.length > 0
      ? `\n**Optional props:** ${optionalProps.map((p) => `\`${p.name}\``).join(', ')}`
      : ''

  return `# ${name}

## Props

${table}

## JSON Example

\`\`\`json
${JSON.stringify(exampleObj, null, 2)}
\`\`\`
${optionalNote}
`
}

// ---------------------------------------------------------------------------
// Main — write output files
// ---------------------------------------------------------------------------

const outputDir = resolve(root, 'skills/generate-ui/references')

if (existsSync(outputDir)) {
  rmSync(outputDir, { recursive: true })
}
mkdirSync(outputDir, { recursive: true })

let count = 0
for (const api of resolvedApis) {
  const markdown = generateMarkdown(api.name, api.schema)
  writeFileSync(join(outputDir, `${api.name}.md`), markdown, 'utf-8')
  console.log(`  ✓ ${api.name}.md`)
  count++
}

console.log(`\nGenerated ${count} component reference file(s) → ${outputDir}`)

// ---------------------------------------------------------------------------
// Extension guide (for custom APIs)
// ---------------------------------------------------------------------------
// To add a custom API, create scripts/custom-catalog-apis.mjs:
//
//   import { z } from '../node_modules/zod/lib/index.mjs'  // or use the Zod that's in your deps
//
//   export const MyCustomApi = {
//     name: 'MyCustom',
//     schema: z.object({
//       title: z.string().describe('The title text'),
//       variant: z.enum(['a', 'b']).default('a').optional(),
//     }).strict()
//   }
