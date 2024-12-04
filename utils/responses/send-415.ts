import { type Context, Status } from '@oak/oak'
import sendHttpError from './send-http-error.ts'

const send415 = (ctx: Context): void => sendHttpError(ctx, Status.UnsupportedMediaType)

export default send415
