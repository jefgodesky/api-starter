import type { NotFoundHandler } from '@hono/hono'
import { HTTP_NOT_FOUND } from '../../constants/http-status.ts'
import createError from '../../utils/jsonapi/error.ts'

const notFound: NotFoundHandler = (c) => {
  const err = createError('notFound')
  return c.json(err, HTTP_NOT_FOUND)
}

export default notFound
