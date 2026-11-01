import { readFileSync } from 'fs'
import { parse } from 'yaml'
import { z } from '@hono/zod-openapi'
import { VersionsSchema, type VersionConfig } from './schema'

const loadVersions = (): VersionConfig[] => {
  const text = readFileSync('versions.yaml', { encoding: 'utf8' })
  const yaml = parse(text)
  const validated = VersionsSchema.safeParse(yaml)

  if (!validated.success) {
    console.error('❌ invalid versions.yaml')
    console.error(z.prettifyError(validated.error))
    process.exit(1)
  }

  return (validated.data).versions
}

export default loadVersions
