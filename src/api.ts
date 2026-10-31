import createAPI from './utils/routers/api.js'
import logger from './log.js'
import document from './utils/document.js'

import { type Router } from './utils/routers/types.js'

import versions from './resources/version/router.ts'

const api = createAPI(logger)
document(api)

const routers: Router[] = [
  versions
]

for (const router of routers) {
  api.route('/', router)
}

export default api
