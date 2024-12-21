import { Middleware } from '@oak/oak'
import { send404 } from '../../../utils/responses/errors.ts'

const requireUser: Middleware = async (ctx, next) => {
  if (!ctx.state.user) {
    send404(ctx)
  } else {
    await next()
  }
}

export default requireUser
