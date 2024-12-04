import { type Context, Status } from '@oak/oak'
import sendHttpError from './send-http-error.ts'

const send406 = (ctx: Context): void => sendHttpError(ctx, Status.NotAcceptable)

export default send406
