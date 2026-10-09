import type { NotFoundHandler } from '@hono/hono'
import { HTTP_NOT_FOUND } from '../../constants/http-status.ts'
import t from '../../utils/intl.ts'

const notFound: NotFoundHandler = (c) => {
  return c.json({
    message: t('errors.notFound')
  }, HTTP_NOT_FOUND)
}

export default notFound
