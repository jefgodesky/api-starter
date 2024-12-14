import { type Context, Status } from '@oak/oak'
import sendHttpError from './send-http-error.ts'

const send401 = (ctx: Context): void => {
  ctx.response.headers.set('WWW-Authenticate', 'Bearer')
  return sendHttpError(ctx, Status.Unauthorized)
}

export default send401
