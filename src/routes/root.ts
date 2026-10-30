import { z, createRoute } from '@hono/zod-openapi'
import { HTTP_OK } from '@revolutionarygamesco/common'
import createRouter from '../utils/routers/router.js'
import wrapRouter from '../utils/routers/wrap.js'

const router = createRouter()
  .openapi(
    createRoute({
      method: 'get',
      path: '/',
      responses: {
        [HTTP_OK]: {
          description: 'Temporary root path',
          content: {
            'application/json': {
              schema: z.object({
                message: z.string()
              })
            }
          }
        }
      }
    }),
    c => {
      return c.json({ message: 'Hello World!' })
    }
  )

export default wrapRouter('', router)
