import createAPI from './utils/routers/api.js'
import logger from './log.js'
import document from './utils/document.js'

const api = createAPI(logger)
document(api)

api.get('/', (c) => {
  c.var.logger.info('Hello, logger!')
  return c.text('Hello Hono!')
})

export default api
