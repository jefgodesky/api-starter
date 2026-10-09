import { OpenAPIHono } from '@hono/zod-openapi'

const app = new OpenAPIHono()

app.get('/', (c) => {
  return c.text('Hello OpenAPI Hono!')
})

Deno.serve(app.fetch)
