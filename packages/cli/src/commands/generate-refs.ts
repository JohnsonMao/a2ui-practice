import { writeFileSync, mkdirSync, rmSync, existsSync, readdirSync, readFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { Command } from 'commander'
import type { ZodType } from 'zod'

// ---------------------------------------------------------------------------
// Typed accessor for Zod internals
// ---------------------------------------------------------------------------

type ZodInternalDef = {
  typeName?: string
  description?: string
  innerType?: ZodType
  defaultValue?: (() => unknown) | unknown
  values?: string[]
  value?: unknown
  options?: ZodType[]
}

type ZodInspectable = {
  description?: string
  _def: ZodInternalDef
  shape?: Record<string, ZodType>
}

function inspect(zodType: ZodType): ZodInspectable {
  return zodType as unknown as ZodInspectable
}

type ZodResolved = { type: string; defaultVal: string; required: boolean }

function resolveZodType(zodType: ZodType): ZodResolved {
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
      const options: ZodType[] = inspect(zodType)._def.options ?? []
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

function cleanDescription(raw: string | undefined): string {
  if (!raw) return '—'
  const cleaned = raw.replace(/^REF:[^|]+\|/, '').trim()
  if (cleaned.startsWith('REF:')) return '—'
  return cleaned || '—'
}

function getDescription(zodType: ZodType): string {
  const insp = inspect(zodType)
  const raw = insp.description ?? insp._def.description
  if (raw) return cleanDescription(raw)
  if (insp._def.innerType) return getDescription(insp._def.innerType)
  return '—'
}

type PropEntry = { name: string; type: string; description: string; defaultVal: string; required: boolean }

function extractProps(schema: ZodType): PropEntry[] {
  const shape = inspect(schema).shape
  if (!shape) return []
  return Object.entries(shape).map(([propName, zodType]) => {
    const description = getDescription(zodType)
    const { type, defaultVal, required } = resolveZodType(zodType)
    return { name: propName, type, description, defaultVal, required }
  })
}

const EXAMPLE_SKIP_PROPS = new Set(['accessibility', 'checks', 'action'])

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

function generateMarkdown(
  name: string,
  schema: ZodType,
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

export function addGenerateRefsCommand(program: Command): void {
  program
    .command('generate-refs')
    .description('Scan *.skill.ts files and generate Markdown reference files')
    .option('-d, --dir <path>', 'directory to scan for *.skill.ts files', process.cwd())
    .option('-o, --out <path>', 'output directory for Markdown files', './references')
    .action(async (options: { dir: string; out: string }) => {
      const scanDir = resolve(options.dir)
      const outputDir = resolve(options.out)

      // Scan for *.skill.ts files recursively
      const skillFiles = findSkillFiles(scanDir)

      if (skillFiles.length === 0) {
        process.stderr.write(`Warning: no *.skill.ts files found under ${scanDir}\n`)
        process.exit(0)
      }

      // Dynamic import each skill file as a side effect to populate the registry
      // Use jiti to support TypeScript skill files without pre-compilation
      // jsx: true is required because skill files may import .tsx catalog components
      // alias resolves tsconfig path aliases (e.g. '@' -> 'src/') for the scanned project
      const alias = resolveTsconfigAlias(scanDir)
      const { createJiti } = await import('jiti')
      const jiti = createJiti(pathToFileURL(process.cwd()).href, { jsx: true, alias })
      for (const filePath of skillFiles) {
        await jiti.import(filePath)
      }

      // Use the SDK's getRegistry to collect all registered entries
      const { getRegistry } = await import('@a2ui/sdk')
      const allSkills = getRegistry()

      if (allSkills.length === 0) {
        process.stderr.write(`Warning: no skills registered after importing ${skillFiles.length} file(s)\n`)
        process.exit(0)
      }

      // Write output
      if (existsSync(outputDir)) {
        rmSync(outputDir, { recursive: true })
      }
      mkdirSync(outputDir, { recursive: true })

      let count = 0
      for (const { api, example, notes } of allSkills) {
        const markdown = generateMarkdown(api.name, api.schema as ZodType, example, notes)
        writeFileSync(join(outputDir, `${api.name}.md`), markdown, 'utf-8')
        console.log(`  ✓ ${api.name}.md`)
        count++
      }

      console.log(`\nGenerated ${count} component reference file(s) → ${outputDir}`)
    })
}

function resolveTsconfigAlias(scanDir: string): Record<string, string> {
  let dir = scanDir
  while (true) {
    for (const name of ['tsconfig.app.json', 'tsconfig.json']) {
      const tscPath = join(dir, name)
      if (existsSync(tscPath)) {
        try {
          const tsconfig = JSON.parse(readFileSync(tscPath, 'utf-8'))
          const paths = tsconfig.compilerOptions?.paths as Record<string, string[]> | undefined
          if (paths) {
            const aliases: Record<string, string> = {}
            for (const [pattern, targets] of Object.entries(paths)) {
              const key = pattern.replace('/*', '')
              const target = targets[0].replace('/*', '')
              aliases[key] = resolve(dir, target)
            }
            return aliases
          }
        } catch { /* skip malformed */ }
      }
    }
    const parent = resolve(dir, '..')
    if (parent === dir) break
    dir = parent
  }
  return {}
}

function findSkillFiles(dir: string): string[] {
  const results: string[] = []
  if (!existsSync(dir)) return results

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      results.push(...findSkillFiles(fullPath))
    } else if (entry.isFile() && entry.name.endsWith('.skill.ts')) {
      results.push(fullPath)
    }
  }
  return results
}
