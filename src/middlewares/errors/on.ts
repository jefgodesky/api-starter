import type { ErrorHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'
import createError from '../../utils/errors/create.ts'
import createErrorResponse from '../../utils/errors/response.ts'

// Needs http-status-codes
const HTTP_INTERNAL_SERVER_ERROR = 500

const onError: ErrorHandler = (err, c) => {
  const x = err instanceof HTTPException
    ? err
    : createError(err.message, { context: c })
  if (x.status === HTTP_INTERNAL_SERVER_ERROR) c.var.logger.withError(err).error('Unhandled error')
  return c.json(createErrorResponse(x), x.status, {
    'Content-Type': 'application/problem+json'
  })
}

export default onError
