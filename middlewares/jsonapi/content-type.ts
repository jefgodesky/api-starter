import { type MiddlewareHandler } from 'hono'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import isValidMediaType from '../../utils/media-type.ts'
import localize from '../../utils/localize.ts'

const enforceJsonApiContentType: MiddlewareHandler = createMiddleware(
  async (c, next) => {
    const contentType = c.req.header('Content-Type')
    const needsTest = contentType && contentType !== '*/*'
    const isValid = needsTest ? isValidMediaType(contentType) : true
    if (!isValid) {
      throw new HTTPException(415, {
        message: localize('jsonapi_enforce_content_type'),
      })
    }
    await next()
  },
)

export default enforceJsonApiContentType
