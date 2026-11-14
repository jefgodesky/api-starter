import { type HonoLogLayerVariables } from '@loglayer/hono'
import {
  OpenAPIHono,
  type RouteConfig,
  type RouteConfigToEnv,
  type RouteHandler
} from '@hono/zod-openapi'

export interface APIVariables extends HonoLogLayerVariables {}

export interface APIEnv {
  Variables: APIVariables
}

export type Router = OpenAPIHono<APIEnv>

export interface RouterMeta {
  readonly resource: string
  readonly path: string
  router: Router
}

export type APIRouteHandler<R extends RouteConfig> = RouteHandler<R, APIEnv & RouteConfigToEnv<R>>
