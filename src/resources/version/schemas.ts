import { z } from '@hono/zod-openapi'
import t from '../../utils/strings/intl.ts'

// From https://semver.org/
export const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/

export const SemVerSchema = z.string()
  .regex(semverRegex, {
    message: t('errors.schema.semver')
  })
  .brand<'SemVer'>()

export type SemVer = z.infer<typeof SemVerSchema>

export const VersionStatusSchema = z.literal([
  'planned',
  'alpha',
  'beta',
  'live',
  'legacy',
  'retired'
])

export type VersionStatus = z.infer<typeof VersionStatusSchema>

export const VersionSchema = z.object({
  sem: SemVerSchema,
  major: z.number().min(0),
  minor: z.number().min(0),
  patch: z.number().min(0),
  prerelease: z.string().optional(),
  build: z.string().optional(),
  path: z.string()
})

export type Version = z.infer<typeof VersionSchema>

export const VersionResponseSchema = z.object({
  version: SemVerSchema,
  uri: z.string(),
  status: VersionStatusSchema
})

export type VersionResponse = z.infer<typeof VersionResponseSchema>
export const VersionResponsesSchema = z.array(VersionResponseSchema)
export type VersionResponses = z.infer<typeof VersionResponsesSchema>
