import { createRoute, z } from '@hono/zod-openapi'
import { StatusCodes } from 'http-status-codes'
import documentResponse from '../../../utils/docs/response.ts'
import schema from './schemas.ts'
import t from '../../../utils/strings/intl.ts'

const route = createRoute({
  method: 'get',
  path: '/',
  responses: {
    ...documentResponse(StatusCodes.OK, t('docs.root.get.200.main'), schema,
      z.looseObject({
        Link: z.string().describe(t('docs.root.get.200.link'))
      })
    )
  }
})

export default route
