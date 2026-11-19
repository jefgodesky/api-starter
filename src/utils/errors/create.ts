import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { HTTPException } from 'hono/http-exception'
import { StatusCodes } from 'http-status-codes'

const statusCodes: Record<string, ContentfulStatusCode> = {
  notFound: StatusCodes.NOT_FOUND,
  forbidden: StatusCodes.FORBIDDEN,
  validation: StatusCodes.UNPROCESSABLE_ENTITY,
  other: StatusCodes.INTERNAL_SERVER_ERROR
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
