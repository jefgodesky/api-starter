import { Application, type Router } from '@oak/oak'

import DB from './DB.ts'
import isTest from './utils/testing/is-test.ts'

import AuthRouter from './collections/auth/router.ts'
import UserRouter from './collections/users/router.ts'

import enforceJsonApiContentType from './middlewares/jsonapi/content-type.ts'
import enforceJsonApiAccept from './middlewares/jsonapi/accept.ts'
import RootRouter from './collections/base/router.ts'
import Swagger from './middlewares/swagger.ts'

const api = new Application()

api.use(Swagger.routes())
api.use(Swagger.allowedMethods())

api.use(enforceJsonApiContentType)
api.use(enforceJsonApiAccept)

const routers: Record<string, Router> = {
  auth: AuthRouter.router,
  users: UserRouter
}

const root = new RootRouter(routers)
api.use(root.router.routes())
api.use(root.router.allowedMethods())

for (const router of Object.values(routers)) {
  api.use(router.routes())
  api.use(router.allowedMethods())
}

api.addEventListener('listen', ({ hostname, port, secure }) => {
  const protocol = secure ? 'https' : 'http'
  const url = `${protocol}://${hostname ?? 'localhost'}:${port}`
  if (!isTest()) console.log(`⚡ Listening on ${url}`)
})

api.addEventListener('close', async () => {
  await DB.close()
})

export default api
