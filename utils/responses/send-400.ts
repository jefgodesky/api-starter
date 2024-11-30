import { type Context, Status } from '@oak/oak'
import sendHttpError from './send-http-error.ts'

const send400 = (ctx: Context): void => sendHttpError(ctx, Status.BadRequest)

export default send400
