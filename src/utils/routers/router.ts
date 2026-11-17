import { type LogLayer } from 'loglayer'
import { OpenAPIHono } from '@hono/zod-openapi'
import { honoLogLayer, type HonoAutoLoggingConfig } from '@loglayer/hono'
import { type APIEnv, type RouterMeta } from '../../types.ts'
import logger from '../../log.js'
import defaultHook from '../errors/zod-hook.ts'

export interface RouterOptions {
  autoLogging?: boolean | HonoAutoLoggingConfig
}

const createRouter = (
  resource: string = '',
  log?: LogLayer,
  {
    autoLogging = true
  }: RouterOptions = {}
): RouterMeta => {
  const path = `/${resource}`
  const instance = log ?? logger
  const router = new OpenAPIHono<APIEnv>({
    strict: false, defaultHook
  }).basePath(path)
  router.use(honoLogLayer({ instance, autoLogging }))
  return {
    resource,
    path: `/${resource}`,
    router
  }
}

export default createRouter
