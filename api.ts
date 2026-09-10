import { OpenAPIHono } from '@hono/zod-openapi'
import { type Env } from './types/jsonapi-query.ts'
import { getAPIVersion } from './version.ts'
import enforceJsonApiAccept from './middlewares/jsonapi/accept.ts'
import enforceJsonApiContentType from './middlewares/jsonapi/content-type.ts'
import parseJSONAPIQuery from './middlewares/jsonapi/query.ts'

import users from './resources/users/router.ts'

const api = new OpenAPIHono<Env>()
  .basePath(getAPIVersion())

api.use('*', enforceJsonApiAccept, enforceJsonApiContentType, parseJSONAPIQuery)
api.get('/', (c) => c.text('Hello, world!'))
api.route('/', users)

export default api
