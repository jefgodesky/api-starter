import createAPI from './utils/routers/api.js'
import logger from './log.js'
import document from './utils/docs/document.ts'

import { type RouterMeta } from './types.ts'
import createRootRouter from './resources/root/router.ts'

const api = createAPI(logger)
document(api)

const routers: RouterMeta[] = []

for (const { router } of routers) {
  api.route('/', router)
}

const root = createRootRouter(routers)
api.route('/', root)

export default api
