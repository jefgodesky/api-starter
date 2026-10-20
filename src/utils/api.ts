import { type LogLayer } from 'loglayer'
import { OpenAPIHono } from '@hono/zod-openapi'
import {
  honoLogLayer,
  type HonoLogLayerVariables,
  type HonoAutoLoggingConfig
} from '@loglayer/hono'

import onError from '../middlewares/errors/on.ts'
import notFound from '../middlewares/errors/404.ts'

export type APISub = {
  Variables: HonoLogLayerVariables
}

export type API = OpenAPIHono<APISub>

export interface APIOptions {
  autoLogging?: boolean | HonoAutoLoggingConfig
}

const createAPI = (
  logger: LogLayer,
  {
    autoLogging = true
  }: APIOptions = {}
): API => {
  const api = new OpenAPIHono<APISub>({ strict: false })
  api.use(honoLogLayer({ instance: logger, autoLogging }))
  api.onError(onError)
  api.notFound(notFound)
  return api
}

export default createAPI
