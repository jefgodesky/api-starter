import { OpenAPIHono } from '@hono/zod-openapi'
import { type Env } from './types/jsonapi-query.ts'
import getEnvNumber from './utils/get-env-num.ts'
import enforceJsonApiAccept from './middlewares/jsonapi/accept.ts'
import enforceJsonApiContentType from './middlewares/jsonapi/content-type.ts'
import parseJSONAPIQuery from './middlewares/jsonapi/query.ts'

import users from './resources/users/router.ts'

const v = getEnvNumber('API_VERSION', 1)
const api = new OpenAPIHono<Env>().basePath(`v${v}`)

api.use('*', enforceJsonApiAccept, enforceJsonApiContentType, parseJSONAPIQuery)
api.get('/', (c) => c.text('Hello, world!'))
api.route('/', users)

export default api
