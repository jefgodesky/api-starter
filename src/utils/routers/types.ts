import {
  type HonoLogLayerVariables,
  type HonoAutoLoggingConfig
} from '@loglayer/hono'
import { OpenAPIHono } from '@hono/zod-openapi'

export type RouterSub = {
  Variables: HonoLogLayerVariables
}

export interface Router extends OpenAPIHono<RouterSub> {
  readonly resource: string
  readonly path: string
}

export interface RouterOptions {
  autoLogging?: boolean | HonoAutoLoggingConfig
}
