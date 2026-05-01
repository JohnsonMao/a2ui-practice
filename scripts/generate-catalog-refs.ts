/**
 * generate-catalog-refs.ts
 *
 * Scans all *.skill.ts files in src/catalog/components/, executes each as a
 * side effect to populate the skill registry, then writes one Markdown
 * reference file per component to skills/generate-ui/references/<ComponentName>.md.
 *
 * Run via: tsx scripts/generate-catalog-refs.ts
 */

import { writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import type { ZodTypeAny } from 'zod'

// ---------------------------------------------------------------------------
// Typed accessor for Zod internals — avoids `any` while inspecting _def
// ---------------------------------------------------------------------------

type ZodInternalDef = {
  typeName?: string
  description?: string
  innerType?: ZodTypeAny
  defaultValue?: (() => unknown) | unknown
  values?: string[]
  value?: unknown
  options?: ZodTypeAny[]
}

type ZodInspectable = {
  description?: string
  _def: ZodInternalDef
  shape?: Record<string, ZodTypeAny>
}

function inspect(zodType: ZodTypeAny): ZodInspectable {
  return zodType as unknown as ZodInspectable
}

const __dir = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dir, '..')

// ---------------------------------------------------------------------------
// Scan *.skill.ts files and execute them to populate the skill registry
// ---------------------------------------------------------------------------

const componentsDir = resolve(root, 'src/catalog/components')
const skillFiles = readdirSync(componentsDir)
  .filter((f) => f.endsWith('.skill.ts'))
  .sort()
  .map((f) => pathToFileURL(resolve(componentsDir, f)).href)

for (const fileUrl of skillFiles) {
  await import(fileUrl)
}

const { getRegistry } = await import('../src/catalog/skill.js')
const allSkills = getRegistry()

// ---------------------------------------------------------------------------
// Zod introspection helpers
// ---------------------------------------------------------------------------

/** Strip "REF:some/path|" prefix used by @a2ui/web_core descriptions. */
function cleanDescription(raw: string | undefined): string {
  if (!raw) return '—'
  const cleaned = raw.replace(/^REF:[^|]+\|/, '').trim()
  if (cleaned.startsWith('REF:')) return '—'
  return cleaned || '—'
}

/** Get description from a Zod field, traversing wrappers. */
function getDescription(zodType: ZodTypeAny): string {
  const insp = inspect(zodType)
  const raw = insp.description ?? insp._def.description
  if (raw) return cleanDescription(raw)
  if (insp._def.innerType) return getDescription(insp._def.innerType)
  return '—'
}

type ZodResolved = { type: string; defaultVal: string; required: boolean }

/** Resolve Zod type to { type, defaultVal, required }. */
function resolveZodType(zodType: ZodTypeAny): ZodResolved {
  const tn = inspect(zodType)._def.typeName

  switch (tn) {
    case 'ZodOptional': {
      const inner = resolveZodType(inspect(zodType)._def.innerType!)
      return { ...inner, required: false }
    }
    case 'ZodNullable': {
      const inner = resolveZodType(inspect(zodType)._def.innerType!)
      return { ...inner, required: false }
    }
    case 'ZodDefault': {
      const insp = inspect(zodType)
      const inner = resolveZodType(insp._def.innerType!)
      const defaultValue = insp._def.defaultValue
      const raw = typeof defaultValue === 'function'
        ? (defaultValue as () => unknown)()
        : defaultValue
      return { ...inner, defaultVal: JSON.stringify(raw), required: false }
    }
    case 'ZodString':
      return { type: 'string', defaultVal: '—', required: true }
    case 'ZodNumber':
      return { type: 'number', defaultVal: '—', required: true }
    case 'ZodBoolean':
      return { type: 'boolean', defaultVal: '—', required: true }
    case 'ZodEnum': {
      const values = (inspect(zodType)._def.values ?? []).map((v) => `"${v}"`).join(' | ')
      return { type: values, defaultVal: '—', required: true }
    }
    case 'ZodLiteral':
      return { type: `"${String(inspect(zodType)._def.value)}"`, defaultVal: '—', required: true }
    case 'ZodObject':
      return { type: 'object', defaultVal: '—', required: true }
    case 'ZodArray':
      return { type: 'array', defaultVal: '—', required: true }
    case 'ZodUnion': {
      const options: ZodTypeAny[] = inspect(zodType)._def.options ?? []
      const firstPrimitive = options.find((o) =>
        ['ZodString', 'ZodNumber', 'ZodBoolean'].includes(inspect(o)._def.typeName ?? ''),
      )
      if (firstPrimitive) {
        const base = resolveZodType(firstPrimitive)
        return { ...base, type: `${base.type} | expression` }
      }
      const allObjects = options.every((o) => inspect(o)._def.typeName === 'ZodObject')
      if (allObjects) return { type: 'object', defaultVal: '—', required: true }
      const types = [...new Set(options.map((o) => resolveZodType(o).type))].join(' | ')
      return { type: types, defaultVal: '—', required: true }
    }
    default:
      return { type: 'unknown', defaultVal: '—', required: true }
  }
}

type PropEntry = { name: string; type: string; description: string; defaultVal: string; required: boolean }

/** Extract all props from a Zod object schema. */
function extractProps(schema: ZodTypeAny): PropEntry[] {
  const shape = inspect(schema).shape
  if (!shape) return []
  return Object.entries(shape).map(([propName, zodType]) => {
    const description = getDescription(zodType)
    const { type, defaultVal, required } = resolveZodType(zodType)
    return { name: propName, type, description, defaultVal, required }
  })
}

/** Prop names to skip in the JSON example (complex or rarely set). */
const EXAMPLE_SKIP_PROPS = new Set(['accessibility', 'checks', 'action'])

/** Generate an example value for a prop based on its name and type. */
function exampleValue(propName: string, type: string): unknown {
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

function generateMarkdown(
  name: string,
  schema: ZodTypeAny,
  exampleFn?: () => Record<string, unknown>,
  notes?: string,
): string {
  const props = extractProps(schema)

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

  const optionalProps = props.filter((p) => !p.required)

  let exampleObj: Record<string, unknown>
  if (exampleFn) {
    exampleObj = exampleFn()
  } else {
    const requiredProps = props.filter((p) => p.required && !EXAMPLE_SKIP_PROPS.has(p.name))
    exampleObj = { id: `my-${name.toLowerCase()}`, component: name }
    for (const p of requiredProps) {
      exampleObj[p.name] = exampleValue(p.name, p.type)
    }
  }

  const optionalNote =
    optionalProps.length > 0
      ? `\n**Optional props:** ${optionalProps.map((p) => `\`${p.name}\``).join(', ')}`
      : ''

  const notesSection = notes ? `\n**Notes:** ${notes}\n` : ''

  return `# ${name}

## Props

${table}

## JSON Example

\`\`\`json
${JSON.stringify(exampleObj, null, 2)}
\`\`\`
${optionalNote}${notesSection}
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
for (const { api, example, notes } of allSkills) {
  const markdown = generateMarkdown(api.name, api.schema as ZodTypeAny, example, notes)
  writeFileSync(join(outputDir, `${api.name}.md`), markdown, 'utf-8')
  console.log(`  ✓ ${api.name}.md`)
  count++
}

console.log(`\nGenerated ${count} component reference file(s) → ${outputDir}`)
