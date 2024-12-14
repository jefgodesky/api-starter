import { Middleware } from '@oak/oak'
import { send401 } from '../../utils/responses/errors.ts'

const requireUser: Middleware = async (ctx, next) => {
  if (!ctx.state.user) {
    send401(ctx)
  } else {
    await next()
  }
}

export default requireUser
