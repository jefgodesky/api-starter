import { Middleware } from '@oak/oak'
import { send406 } from '../../utils/responses/errors.ts'
import isValidMediaType from '../../utils/is-valid-media-type.ts'

const enforceJsonApiAccept: Middleware = async (ctx, next) => {
  const accept = ctx.request.headers.get('Accept')
  let unacceptable = false

  if (accept) {
    const types = accept.split(',').map(t => t.trim())
    unacceptable = !types.some(t => isValidMediaType(t) || t === '*/*')
  }

  if (unacceptable) {
    send406(ctx)
  } else {
    await next()
  }
}

export default enforceJsonApiAccept
