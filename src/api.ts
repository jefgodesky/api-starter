import { OpenAPIHono } from '@hono/zod-openapi'

import notFound from './middlewares/errors/404.ts'

const api = new OpenAPIHono()

api.get('/', (c) => {
  return c.text('Hello OpenAPI Hono!')
})

api.notFound(notFound)

export default api
