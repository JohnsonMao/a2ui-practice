import type { ComponentApi, InferredComponentApiSchemaType } from '@a2ui/web_core/v0_9'

/**
 * The shape that a skill example function must return:
 * the A2UI component envelope fields (`id`, `component`) plus
 * all props inferred from the component's Zod schema.
 */
type SkillExampleResult<Api extends ComponentApi> = {
  id: string
  component: string
} & InferredComponentApiSchemaType<Api>

export type SkillEntry = {
  api: ComponentApi
  example: () => Record<string, unknown>
  notes?: string
}

const registry: SkillEntry[] = []

export const a2ui = {
  skill<Api extends ComponentApi>(
    api: Api,
    options: { example: () => SkillExampleResult<Api>; notes?: string },
  ): void {
    registry.push({ api, example: options.example, notes: options.notes })
  },
}

export function getRegistry(): SkillEntry[] {
  return [...registry]
}
