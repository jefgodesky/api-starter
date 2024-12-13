import { Middleware } from '@oak/oak'
import { isTokenCreation } from '../../../types/token-creation.ts'
import { send400 } from '../../../utils/responses/errors.ts'

const requireTokenCreationBody: Middleware = async (ctx, next) => {
  const body = await ctx.request.body.json()
  if (!isTokenCreation(body)) {
    send400(ctx)
  } else {
    await next()
  }
}

export default requireTokenCreationBody
