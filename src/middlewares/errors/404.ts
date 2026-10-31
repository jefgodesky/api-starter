import type { NotFoundHandler } from 'hono'
import { HTTP_NOT_FOUND } from '@revolutionarygamesco/common'
import createError from '../../utils/errors/create.ts'
import createErrorResponse from '../../utils/errors/response.ts'

const notFound: NotFoundHandler = (c) => {
  const err = createError('notFound', { context: c })
  return c.json(createErrorResponse(err), HTTP_NOT_FOUND)
}

export default notFound
