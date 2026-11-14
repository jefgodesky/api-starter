import createAPI from './utils/routers/api.js'
import logger from './log.js'
import document from './utils/document.js'

import { type RouterMeta } from './types.ts'
import createRootRouter from './routes/root.ts'

const api = createAPI(logger)
document(api)

const routers: RouterMeta[] = []

for (const { router } of routers) {
  api.route('/', router)
}

const root = createRootRouter(routers)
api.route('/', root)

export default api
