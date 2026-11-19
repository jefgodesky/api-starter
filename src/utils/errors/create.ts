import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { HTTPException } from 'hono/http-exception'

// Needs http-status-codes
const HTTP_FORBIDDEN = 403
const HTTP_NOT_FOUND = 404
const HTTP_UNPROCESSABLE_CONTENT = 422
const HTTP_INTERNAL_SERVER_ERROR = 500

const statusCodes: Record<string, ContentfulStatusCode> = {
  notFound: HTTP_NOT_FOUND,
  forbidden: HTTP_FORBIDDEN,
  validation: HTTP_UNPROCESSABLE_CONTENT,
  other: HTTP_INTERNAL_SERVER_ERROR
}

const createError = (
  key: string,
  cause: Record<string, unknown> = {}
): HTTPException => {
  const k = key in statusCodes ? key : 'other'
  const status = statusCodes[k]
  return new HTTPException(status, { message: k, cause })
}

export default createError
