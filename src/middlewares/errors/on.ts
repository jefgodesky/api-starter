import type { ErrorHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { StatusCodes } from 'http-status-codes'
import createError from '../../utils/errors/create.ts'
import createErrorResponse from '../../utils/errors/response.ts'

const onError: ErrorHandler = (err, c) => {
  const x = err instanceof HTTPException
    ? err
    : createError(err.message, { context: c })
  if (x.status === StatusCodes.INTERNAL_SERVER_ERROR) c.var.logger.withError(err).error('Unhandled error')
  return c.json(createErrorResponse(x), x.status, {
    'Content-Type': 'application/problem+json'
  })
}

export default onError
