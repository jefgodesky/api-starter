import { type ValidationTargets } from 'hono'
import { type ZodError } from 'zod'
import { type Issue } from './schemas.ts'
import locateIssue from './locate.ts'

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
