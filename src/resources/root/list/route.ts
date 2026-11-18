import { createRoute, z } from '@hono/zod-openapi'
import { HTTP_OK } from '@revolutionarygamesco/common'
import documentResponse from '../../../utils/docs/response.ts'
import schema from './schemas.ts'
import t from '../../../utils/strings/intl.ts'

const route = createRoute({
  method: 'get',
  path: '/',
  responses: {
    [HTTP_OK]: documentResponse(t('docs.root.get.200.main'), schema,
      z.looseObject({
        Link: z.string().describe(t('docs.root.get.200.link'))
      })
    )
  }
})

export default route
