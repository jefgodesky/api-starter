import { Middleware } from '@oak/oak'
import { send415 } from '../../utils/responses/errors.ts'
import isValidMediaType from '../../utils/is-valid-media-type.ts'

const enforceJsonApiContentType: Middleware = async (ctx, next) => {
  const contentType = ctx.request.headers.get('Content-Type')
  if (!contentType || isValidMediaType(contentType)) {
    await next()
  } else {
    send415(ctx)
  }
}

export default enforceJsonApiContentType
