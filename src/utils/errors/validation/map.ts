import { type ValidationTargets } from 'hono'
import { type ZodError } from 'zod'
import locateIssue, { type IssueLocationTarget } from './locate.ts'

export interface Issue {
  detail: string
  code: string
  target: IssueLocationTarget
  pointer: string
}

const mapIssues = (
  target: keyof ValidationTargets,
  error: ZodError
): Issue[] => {
  return error.issues.map(issue => ({
    detail: issue.message,
    code: issue.code,
    ...locateIssue(target, issue.path)
  }))
}

export default mapIssues
