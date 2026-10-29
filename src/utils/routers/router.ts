import { type LogLayer } from 'loglayer'
import { OpenAPIHono } from '@hono/zod-openapi'
import {
  honoLogLayer,
  type HonoLogLayerVariables,
  type HonoAutoLoggingConfig
} from '@loglayer/hono'
import logger from '../../log.js'

export type RouterSub = {
  Variables: HonoLogLayerVariables
}

export type Router = OpenAPIHono<RouterSub>

export interface RouterOptions {
  autoLogging?: boolean | HonoAutoLoggingConfig
}

const createRouter = (
  log?: LogLayer,
  {
    autoLogging = true
  }: RouterOptions = {}
): Router => {
  const instance = log ?? logger
  const router = new OpenAPIHono<RouterSub>({ strict: false })
  router.use(honoLogLayer({ instance, autoLogging }))
  return router
}

export default createRouter
