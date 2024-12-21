import { Middleware, Status } from '@oak/oak'
import { createHttpError } from 'jsr:@oak/commons@1/http_errors'
import getMessage from '../../../utils/get-message.ts'

const requireUser: Middleware = async (ctx, next) => {
  if (!ctx.state.user) throw createHttpError(Status.NotFound, getMessage('user_not_found'))
  await next()
}

export default requireUser
