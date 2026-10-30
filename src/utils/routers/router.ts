import { type LogLayer } from 'loglayer'
import { OpenAPIHono } from '@hono/zod-openapi'
import { honoLogLayer } from '@loglayer/hono'
import { type RouterOptions, type RouterSub, type Router } from './types.js'
import logger from '../../log.js'
import wrapRouter from './wrap.js'

const createRouter = (
  resource: string = '',
  log?: LogLayer,
  {
    autoLogging = true
  }: RouterOptions = {}
): Router => {
  const path = `/${resource}`
  const instance = log ?? logger
  const router = new OpenAPIHono<RouterSub>({ strict: false }).basePath(path)
  router.use(honoLogLayer({ instance, autoLogging }))
  return wrapRouter(resource, router)
}

export default createRouter
