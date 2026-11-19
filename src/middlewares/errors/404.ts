import type { NotFoundHandler } from 'hono'
import createError from '../../utils/errors/create.ts'
import createErrorResponse from '../../utils/errors/response.ts'

// Needs http-status-codes
const HTTP_NOT_FOUND = 404

const notFound: NotFoundHandler = (c) => {
  const err = createError('notFound', { context: c })
  return c.json(createErrorResponse(err), HTTP_NOT_FOUND, {
    'Content-Type': 'application/problem+json'
  })
}

export default notFound
