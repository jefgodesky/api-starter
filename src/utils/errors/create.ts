import type { ContentfulStatusCode } from '@hono/hono/utils/http-status'

import { HTTPException } from '@hono/hono/http-exception'
import {
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_NOT_FOUND
} from '../../constants/http-status.ts'

const statusCodes: Record<string, ContentfulStatusCode> = {
  notFound: HTTP_NOT_FOUND,
  other: HTTP_INTERNAL_SERVER_ERROR
}

const createError = (
  key: string,
  cause: Record<string, unknown> = {}
): HTTPException => {
  const status = statusCodes[key] ?? statusCodes.other
  return new HTTPException(status, { message: key, cause })
}

export default createError
