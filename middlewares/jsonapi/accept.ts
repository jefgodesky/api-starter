import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import isValidMediaType from '../../utils/media-type.ts'
import localize from '../../utils/localize.ts'

const enforceJsonApiAccept = createMiddleware(async (c, next) => {
  const accept = c.req.header('Accept')
  if (accept) {
    const types = accept.split(',').map((t) => t.trim())
    const ok = types.some((t) => isValidMediaType(t) || t === '*/*')

    if (!ok) {
      throw new HTTPException(406, {
        message: localize('jsonapi_enforce_accept'),
      })
    }
  }

  await next()
})

export default enforceJsonApiAccept
