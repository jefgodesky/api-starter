import { OpenAPIHono } from '@hono/zod-openapi'
import { honoLogLayer, type HonoLogLayerVariables } from '@loglayer/hono'

import log from './log.ts'

const api = new OpenAPIHono<{ Variables: HonoLogLayerVariables }>()
api.use(honoLogLayer({ instance: log }))

api.get('/', (c) => {
  c.var.logger.info('Hello, logger!')
  return c.text('Hello Hono!')
})

export default api
