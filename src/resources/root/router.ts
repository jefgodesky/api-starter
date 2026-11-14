import { type RouterMeta } from '../../types.ts'
import createRouter from '../../utils/routers/router.ts'
import listRoute from './list/route.ts'
import createRootListHandler from './list/handler.ts'

const createRootRouter = (routers: RouterMeta[]) => {
  const { router } = createRouter()
  return router.openapi(listRoute, createRootListHandler(routers))
}

export default createRootRouter
