import type { NotFoundHandler } from '@hono/hono'
import createError from '../../utils/jsonapi/error.ts'

const notFound: NotFoundHandler = (c) => {
  const { body, status } = createError('notFound', { path: c.req.path })
  return c.json(body, status)
}

export default notFound
