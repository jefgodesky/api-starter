import type { NotFoundHandler } from '@hono/hono'
import createError from '../../utils/errors/create.ts'
import createErrorResponse from '../../utils/jsonapi/error.ts'

const notFound: NotFoundHandler = (c) => {
  const err = createError('notFound', { context: c })
  const { body, status } = createErrorResponse(err)
  return c.json(body, status)
}

export default notFound
