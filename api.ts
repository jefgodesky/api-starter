import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { type Env } from './types/jsonapi-query.ts'
import { API_VERSION, getAPIVersion } from './version.ts'
import localize from './utils/localize.ts'
import { getUnversionedRoot } from './utils/root.ts'
import enforceJsonApiAccept from './middlewares/jsonapi/accept.ts'
import enforceJsonApiContentType from './middlewares/jsonapi/content-type.ts'
import parseJSONAPIQuery from './middlewares/jsonapi/query.ts'

import users from './resources/users/router.ts'

const api = new OpenAPIHono<Env>()
  .basePath(getAPIVersion())

api.use('*', enforceJsonApiAccept, enforceJsonApiContentType, parseJSONAPIQuery)
api.get('/', (c) => c.text('Hello, world!'))
api.route('/', users)

api.doc31('/openapi.json', {
  openapi: '3.1.0',
  info: {
    title: localize('docs.title'),
    version: API_VERSION,
    description: localize('docs.description'),
  },
  servers: [{ url: getUnversionedRoot() }],
})

api.get('/docs', swaggerUI({ url: `/${getAPIVersion()}/openapi.json` }))

export default api
