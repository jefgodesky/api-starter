import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { HTTPException } from 'hono/http-exception'
import {
  HTTP_FORBIDDEN,
  HTTP_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR
} from '@revolutionarygamesco/common'

const statusCodes: Record<string, ContentfulStatusCode> = {
  notFound: HTTP_NOT_FOUND,
  forbidden: HTTP_FORBIDDEN,
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
