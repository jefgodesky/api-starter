import { z } from '@hono/zod-openapi'
import t from '../../strings/intl.ts'

export const IssueTargetSchema = z
  .enum(['body', 'query', 'path', 'header', 'cookie'])
  .describe(t('docs.schemas.issue.target'))
export type IssueTarget = z.infer<typeof IssueTargetSchema>

export const PointerSchema = z.string()
  .regex(/^(\/([^~/]|~[01])*)*$/)
  .describe(t('docs.schemas.issue.pointer'))
export type Pointer = z.infer<typeof PointerSchema>

export const IssueLocationSchema = z.object({
  target: IssueTargetSchema,
  pointer: PointerSchema
})
export type IssueLocation = z.infer<typeof IssueLocationSchema>

export const IssueSchema = IssueLocationSchema.extend({
  detail: z.string().describe(t('docs.schemas.issue.detail')),
  code: z.string().describe(t('docs.schemas.issue.code')),
}).openapi('Issue')
export type Issue = z.infer<typeof IssueSchema>

export const ValidationCauseSchema = z.object({
  issues: IssueSchema.array().min(1)
})
export type ValidationCause = z.infer<typeof ValidationCauseSchema>
