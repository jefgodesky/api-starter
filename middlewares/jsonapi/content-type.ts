import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import isValidMediaType from '../../utils/media-type.ts'
import localize from '../../utils/localize.ts'

const enforceJsonApiContentType = createMiddleware(async (c, next) => {
  const contentType = c.req.header('Content-Type')
  if (contentType && !isValidMediaType(contentType)) {
    throw new HTTPException(415, {
      message: localize('jsonapi_enforce_content_type'),
    })
  }
  await next()
})

export default enforceJsonApiContentType
