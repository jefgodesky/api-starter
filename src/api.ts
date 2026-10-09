import { OpenAPIHono } from '@hono/zod-openapi'

const api = new OpenAPIHono()

api.get('/', (c) => {
  return c.text('Hello OpenAPI Hono!')
})

export default api
