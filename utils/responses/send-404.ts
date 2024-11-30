import { type Context, Status } from '@oak/oak'
import sendHttpError from './send-http-error.ts'

const send404 = (ctx: Context): void => sendHttpError(ctx, Status.NotFound)

export default send404
