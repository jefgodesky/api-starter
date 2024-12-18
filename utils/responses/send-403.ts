import { type Context, Status } from '@oak/oak'
import sendHttpError from './send-http-error.ts'

const send403 = (ctx: Context): void => sendHttpError(ctx, Status.Forbidden)

export default send403
