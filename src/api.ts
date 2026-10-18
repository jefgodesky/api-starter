import { OpenAPIHono } from '@hono/zod-openapi'
import { honoLogLayer, type HonoLogLayerVariables } from '@loglayer/hono'

import onError from './middlewares/errors/on.js'

import log from './log.ts'

const api = new OpenAPIHono<{ Variables: HonoLogLayerVariables }>()
api.use(honoLogLayer({ instance: log }))

api.get('/', (c) => {
  c.var.logger.info('Hello, logger!')
  return c.text('Hello Hono!')
})

api.onError(onError)

export default api
