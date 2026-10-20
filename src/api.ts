import { OpenAPIHono } from '@hono/zod-openapi'
import { honoLogLayer, type HonoLogLayerVariables } from '@loglayer/hono'

import onError from './middlewares/errors/on.js'
import notFound from './middlewares/errors/404.js'

import logger from './log.ts'

const api = new OpenAPIHono<{ Variables: HonoLogLayerVariables }>({
  strict: false
})

api.use(honoLogLayer({ instance: logger }))

api.get('/', (c) => {
  c.var.logger.info('Hello, logger!')
  return c.text('Hello Hono!')
})

api.onError(onError)
api.notFound(notFound)

export default api
