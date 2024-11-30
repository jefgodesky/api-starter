import { type Context, Status } from '@oak/oak'
import sendHttpError from './send-http-error.ts'

const send500 = (ctx: Context): void => sendHttpError(ctx, Status.InternalServerError)

export default send500
