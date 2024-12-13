import { Router } from '@oak/oak'
import RootRouter from '../base/router.ts'
import TokenRouter from './tokens/router.ts'

const routers: Record<string, Router> = {
  tokens: TokenRouter
}

const root = new RootRouter(routers, 'auth')
root.router.use(root.router.routes())
root.router.use(root.router.allowedMethods())

for (const subrouter of Object.values(routers)) {
  root.router.use(subrouter.routes())
  root.router.use(subrouter.allowedMethods())
}

export default root
