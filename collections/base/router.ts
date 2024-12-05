import { Router } from '@oak/oak'
import { Response, Links } from '../../jsonapi.d.ts'
import getJSONAPI from '../../utils/get-jsonapi.ts'
import sendJSON from '../../utils/responses/send-json.ts'
import getRoot from '../../utils/get-root.ts'
import getPrefix from '../../utils/get-prefix.ts'

class RootRouter {
  routers: Record<string, Router>
  router: Router

  constructor (routers: Record<string, Router>) {
    this.routers = routers
    this.router = new Router({
      methods: ['GET'],
      prefix: getPrefix()
    })

    this.router.get('/', async ctx => {
      sendJSON(ctx, this.getResponse())
    })
  }

  getResponse (): Response {
    const links: Links = {
      self: getRoot(),
      describedBy: getRoot() + '/docs'
    }

    for (const endpoint in this.routers) {
      links[endpoint] = [getRoot(), endpoint].join('/')
    }

    return {
      jsonapi: getJSONAPI(),
      links
    }
  }
}

export default RootRouter
