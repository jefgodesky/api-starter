import createAPI from './utils/routers/api.js'
import logger from './log.js'
import document from './utils/document.js'

import { type Router } from './utils/routers/types.js'
import root from './routes/root.js'

const api = createAPI(logger)
document(api)

const routers: Router[] = [
  root
]

for (const router of routers) {
  api.route('/', router)
}

export default api
