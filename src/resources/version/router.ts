import { createRoute } from '@hono/zod-openapi'
import { HTTP_OK } from '@revolutionarygamesco/common'
import { VersionResponsesSchema } from './schemas.ts'
import listVersions from './list.ts'
import createRouter from '../../utils/routers/router.ts'
import wrapRouter from '../../utils/routers/wrap.ts'

const router = createRouter()
  .openapi(
    createRoute({
      method: 'get',
      path: '/',
      responses: {
        [HTTP_OK]: {
          description: 'A list of versions of the API.',
          content: {
            'application/json': {
              schema: VersionResponsesSchema
            }
          }
        }
      }
    }),
    c => {
      return c.json(listVersions())
    }
  )

export default wrapRouter('', router)
