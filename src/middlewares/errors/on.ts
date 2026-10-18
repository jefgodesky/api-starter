import type { ErrorHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { HTTP_INTERNAL_SERVER_ERROR } from '@revolutionarygamesco/common'
import createError from '../../utils/errors/create.ts'
import createErrorResponse from '../../utils/jsonapi/error.ts'

const onError: ErrorHandler = (err, c) => {
  const x = err instanceof HTTPException
    ? err
    : createError(err.message, { context: c })
  if (x.status === HTTP_INTERNAL_SERVER_ERROR) c.var.logger.withError(err).error('Unhandled error')
  const { body, status } = createErrorResponse(x)
  return c.json(body, status)
}

export default onError
