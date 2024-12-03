import { Middleware } from '@oak/oak'
import { isUserCreation } from '../../../types/user-creation.ts'
import { send400 } from '../../../utils/responses/errors.ts'

const requireUserCreationBody: Middleware = async (ctx, next) => {
  const body = await ctx.request.body.json()
  if (!isUserCreation(body)) {
    send400(ctx)
  } else {
    await next()
  }
}

export default requireUserCreationBody
