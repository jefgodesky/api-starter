import { type LogLayer } from 'loglayer'
import { HTTP_PERMANENT_REDIRECT } from '@revolutionarygamesco/common'

import type { Router, RouterOptions } from './types.js'
import createRouter from './router.js'
import wrapRouter from './wrap.js'
import versionPath from '../strings/path.js'
import onError from '../../middlewares/errors/on.ts'
import notFound from '../../middlewares/errors/404.ts'

export type API = Router

const createAPI = (
  logger?: LogLayer,
  options?: RouterOptions
): API => {
  const root = createRouter('', logger, options)
  root.onError(onError)
  root.get('/', c => c.redirect(versionPath('/'), HTTP_PERMANENT_REDIRECT))

  const versioned = root.basePath(versionPath('/'))
  versioned.notFound(notFound)
  return wrapRouter('', versioned)
}

export default createAPI
