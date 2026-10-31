import { type LogLayer } from 'loglayer'

import type { Router, RouterOptions } from './types.js'
import createRouter from './router.js'
import onError from '../../middlewares/errors/on.ts'
import notFound from '../../middlewares/errors/404.ts'

export type API = Router

const createAPI = (
  logger?: LogLayer,
  options?: RouterOptions
): API => {
  const router = createRouter('', logger, options)
  router.onError(onError)
  router.notFound(notFound)
  return Object.assign(router, { resource: 'version', path: '/' }) as unknown as API
}

export default createAPI
