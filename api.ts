import { Application, type Router } from '@oak/oak'

import DB from './DB.ts'

import AccountRouter from './collections/accounts/router.ts'
import AuthRouter from './collections/auth/router.ts'
import UserRouter from './collections/users/router.ts'

import enforceJsonApiContentType from './middlewares/jsonapi/content-type.ts'
import enforceJsonApiAccept from './middlewares/jsonapi/accept.ts'
import RootRouter from './collections/base/router.ts'
import Swagger from './middlewares/swagger.ts'

import getRouteParams from './utils/get-route-params.ts'

const api = new Application()

api.use(Swagger.routes())
api.use(Swagger.allowedMethods())

api.use(enforceJsonApiContentType)
api.use(enforceJsonApiAccept)

const routers: Record<string, Router> = {
  accounts: AccountRouter,
  auth: AuthRouter.router,
  users: UserRouter
}

// Add route params to context state for middlewares
api.use(async (ctx, next) => {
  ctx.state.params = {}
  for (const key in routers) {
    const router = routers[key] as Router
    router.forEach(route => {
      ctx.state.params = Object.assign(
        {},
        ctx.state.params,
        getRouteParams(ctx.request.url.pathname, route.regexp, route.paramNames)
      )
    })
  }
  await next()
})

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
  console.log(`⚡ Listening on ${url}`)
})

api.addEventListener('close', async () => {
  await DB.close()
})

export default api
