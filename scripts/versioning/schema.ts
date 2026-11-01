import { z } from '@hono/zod-openapi'
import { makeOxfordList } from '@revolutionarygamesco/common'
import { semverRegex } from '../../src/utils/version/parse'
import parseVersion from '../../src/utils/version/parse'
import getImageTag from './utils/image-tag'

export const VersionStatusSchema = z.literal([
  'successor-version',
  'latest-version',
  'predecessor-version'
])

export const VersionSchema = z.object({
  version: z.string().regex(semverRegex, 'must be a semantic version (e.g., 1.0.0). See https://semver.org/'),
  path: z.string().regex(/^\/v\d+$/, 'must follow the form /vX (e.g., /v1 or /v2)'),
  status: VersionStatusSchema,
  image: z.string().optional()
}).superRefine((v, c) => {
  const { path } = parseVersion(v.version)
  if (v.path !== `/${path}`) {
    c.addIssue({
      code: 'custom',
      path: ['path'],
      message: `version ${v.version} serves /${path}, not ${v.path}`
    })
  }

  const tag = v.image ? getImageTag(v.image) : undefined
  if (tag && semverRegex.test(tag) && tag !== v.version) {
    c.addIssue({
      code: 'custom',
      path: ['image'],
      message: `image tag ${tag} doesn’t match version ${v.version}`
    })
  }
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
})

export type VersionConfig = z.infer<typeof VersionSchema>
