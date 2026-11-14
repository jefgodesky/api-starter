import { createRoute, z } from '@hono/zod-openapi'
import { HTTP_OK } from '@revolutionarygamesco/common'
import t from '../../../utils/strings/intl.ts'
import schema from './schemas.ts'

const route = createRoute({
  method: 'get',
  path: '/',
  responses: {
    [HTTP_OK]: {
      description: t('docs.root.get.200.main'),
      headers: z.looseObject({
        Link: z.string().describe(t('docs.root.get.200.link'))
      }),
      content: {
        'application/json': { schema }
      }
    }
  }
})

export default route
