import { type LogLayer } from 'loglayer'
import { OpenAPIHono } from '@hono/zod-openapi'
import {
  honoLogLayer,
  type HonoLogLayerVariables,
  type HonoAutoLoggingConfig
} from '@loglayer/hono'
import { HTTP_PERMANENT_REDIRECT } from '@revolutionarygamesco/common'

import versionPath from './strings/path.js'
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
  const root = new OpenAPIHono<APISub>({ strict: false })
  root.use(honoLogLayer({ instance: logger, autoLogging }))
  root.onError(onError)
  root.get('/', c => c.redirect(versionPath('/'), HTTP_PERMANENT_REDIRECT))

  const versioned = root.basePath(versionPath('/'))
  versioned.notFound(notFound)
  return versioned
}

export default createAPI
