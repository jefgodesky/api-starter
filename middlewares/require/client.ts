import { Middleware, Status } from '@oak/oak'
import { createHttpError } from 'jsr:@oak/commons@1/http_errors'
import getMessage from '../../utils/get-message.ts'

const requireClient: Middleware = async (ctx, next) => {
  if (!ctx.state.client) throw createHttpError(Status.Unauthorized, getMessage('authentication_required'))
  await next()
}

export default requireClient
