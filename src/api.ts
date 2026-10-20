import createAPI from './utils/api.js'
import logger from './log.js'

const api = createAPI(logger)

api.get('/', (c) => {
  c.var.logger.info('Hello, logger!')
  return c.text('Hello Hono!')
})

export default api
