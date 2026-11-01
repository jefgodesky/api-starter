import { z } from '@hono/zod-openapi'
import { VersionsSchema, type VersionConfig } from './schema.ts'
import readYAML from '../read-yaml'

const loadVersions = (): VersionConfig[] => {
  const validated = VersionsSchema.safeParse(readYAML('versions.yaml'))

  if (!validated.success) {
    console.error('❌ invalid versions.yaml')
    console.error(z.prettifyError(validated.error))
    process.exit(1)
  }

  return (validated.data).versions
}

export default loadVersions
