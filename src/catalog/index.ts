import { Catalog } from '@a2ui/web_core/v0_9'
import type { ReactComponentImplementation } from '@a2ui/react/v0_9'

const modules = import.meta.glob<Record<string, ReactComponentImplementation>>(
  './components/*.tsx',
  { eager: true },
)

const impls = Object.values(modules).flatMap((mod) =>
  Object.values(mod).filter(
    (v): v is ReactComponentImplementation =>
      v !== null && typeof v === 'object' && 'name' in v && 'schema' in v,
  ),
)

export const customCatalog = new Catalog<ReactComponentImplementation>('custom', impls)
