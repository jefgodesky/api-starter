import { type ValidationTargets } from 'hono'
import { type ZodError } from 'zod'
import locateZodIssue, { type ZodIssueLocationTarget } from './locate-zod-issue.ts'

export interface ZodIssue {
  detail: string
  code: string
  target: ZodIssueLocationTarget
  pointer: string
}

const mapZodIssues = (
  target: keyof ValidationTargets,
  error: ZodError
): ZodIssue[] => {
  return error.issues.map(issue => ({
    detail: issue.message,
    code: issue.code,
    ...locateZodIssue(target, issue.path)
  }))
}

export default mapZodIssues
