import { type NotFoundHandler } from 'hono'
import { StatusCodes } from 'http-status-codes'
import createError from '../../utils/errors/create.ts'
import createErrorResponse from '../../utils/errors/response.ts'

const notFound: NotFoundHandler = (c) => {
  const err = createError('notFound', { context: c })
  return c.json(createErrorResponse(err), StatusCodes.NOT_FOUND, {
    'Content-Type': 'application/problem+json'
  })
}

export default notFound
