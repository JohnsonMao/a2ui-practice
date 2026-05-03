import { a2ui } from '@a2ui/sdk'
import type { ComponentApi } from '@a2ui/web_core/v0_9'
import { z } from 'zod'

/**
 * A minimal example showing how to define a ComponentApi and register it with a2ui.
 *
 * In a real project you would import `ButtonApi` from your component file
 * (e.g. `import { ButtonApi } from './button'`).
 * Here we define it inline to keep the example self-contained.
 */
const ButtonApi = {
  name: 'Button',
  schema: z.object({
    variant: z
      .enum(['default', 'primary', 'borderless'])
      .describe(
        'Visual style. Use "primary" for emphasis, "default" for standard actions, and "borderless" for low-emphasis actions.',
      )
      .optional(),
    label: z.string().describe('Text displayed inside the button.'),
  }).strict(),
} satisfies ComponentApi

a2ui.skill(ButtonApi, {
  example: () => ({
    id: 'my-button',
    component: 'Button',
    variant: 'primary' as const,
    label: 'Click me',
  }),
  notes:
    'Use variant="primary" for the main CTA on a page. Use variant="default" for standard actions.',
})
