import { type HTTPException } from 'hono/http-exception'
import { ValidationCauseSchema, type Issue } from './schemas.ts'
import getErrorCause from '../cause.ts'

const getIssues = (err: HTTPException): Issue[] | null => {
  const parsed = ValidationCauseSchema.safeParse(getErrorCause(err))
  return parsed.success && parsed.data.issues.length > 0
    ? parsed.data.issues
    : null
}

export default getIssues
