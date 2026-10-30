import { type OpenAPIHono } from '@hono/zod-openapi'
import { type RouterSub, type Router } from './types.js'

const wrapRouter = (
  resource: string,
  hono: OpenAPIHono<RouterSub>
): Router => {
  const path = `/${resource}`
  return Object.assign(hono, { resource, path }) as unknown as Router
}

export default wrapRouter
