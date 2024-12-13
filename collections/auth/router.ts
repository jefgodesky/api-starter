import { Router } from '@oak/oak'
import type ProviderResource from '../../types/provider-resource.ts'
import { PROVIDERS } from '../../types/provider.ts'
import RootRouter from '../base/router.ts'
import TokenRouter from './tokens/router.ts'

import getJSONAPI from '../../utils/get-jsonapi.ts'
import getRoot from '../../utils/get-root.ts'
import sendJSON from '../../utils/responses/send-json.ts'

const providers = new Router({
  methods: ['GET'],
  prefix: '/providers'
})

providers.get('/', ctx => {
  const providers: ProviderResource[] = []
  for (const id of Object.values(PROVIDERS)) {
    providers.push({ type: 'provider', id })
  }

  sendJSON(ctx, {
    jsonapi: getJSONAPI(),
    links: {
      self: getRoot() + '/auth/providers',
      describedBy: getRoot() + '/docs'
    },
    data: providers
  })
})

const routers: Record<string, Router> = {
  tokens: TokenRouter,
  providers
}

const root = new RootRouter(routers, 'auth')
root.router.use(root.router.routes())
root.router.use(root.router.allowedMethods())

for (const subrouter of Object.values(routers)) {
  root.router.use(subrouter.routes())
  root.router.use(subrouter.allowedMethods())
}

export default root
