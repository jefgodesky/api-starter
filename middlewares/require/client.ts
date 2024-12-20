import { Middleware } from '@oak/oak'
import { send401 } from '../../utils/responses/errors.ts'

const requireClient: Middleware = async (ctx, next) => {
  if (!ctx.state.client) {
    send401(ctx)
  } else {
    await next()
  }
}

export default requireClient
