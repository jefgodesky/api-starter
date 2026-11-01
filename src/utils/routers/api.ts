import { type LogLayer } from 'loglayer'

import type { Router, RouterOptions } from './types.js'
import createRouter from './router.js'
import parseVersion from '../version/parse.ts'
import onError from '../../middlewares/errors/on.ts'
import notFound from '../../middlewares/errors/404.ts'

export type API = Router

const createAPI = (
  logger?: LogLayer,
  options?: RouterOptions
): API => {
  const { path } = parseVersion()
  const router = createRouter(path, logger, options)
  router.onError(onError)
  router.notFound(notFound)
  return router
}

export default createAPI
