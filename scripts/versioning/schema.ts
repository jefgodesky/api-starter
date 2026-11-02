import { z } from '@hono/zod-openapi'
import { makeOxfordList } from '@revolutionarygamesco/common'
import parseVersion from '../../src/utils/version/parse'

export const VersionStatusSchema = z.literal([
  'successor-version',
  'latest-version',
  'predecessor-version'
])

export const VersionSchema = z.object({
  path: z.string().regex(/^\/v\d+$/, 'must follow the form /vX (e.g., /v1 or /v2)'),
  status: VersionStatusSchema,
  image: z.string().optional()
})

export const VersionsSchema = z.object({
  versions: z.array(VersionSchema).min(1)
}).superRefine(({ versions }, c) => {
  const paths = versions.map(v => v.path)
  const dupes = paths.filter((p, i) => paths.indexOf(p) !== i)
  if (dupes.length > 0) {
    c.addIssue({
      code: 'custom',
      message: `paths ${makeOxfordList(dupes)} are duplicated`,
    })
  }

  const latest = versions.map(v => v.status === 'latest-version').length
  if (latest !== 1) {
    c.addIssue({
      code: 'custom',
      message: `you must have one and only latest-version (found ${latest})`
    })
  }
})

export type VersionConfig = z.infer<typeof VersionSchema>
