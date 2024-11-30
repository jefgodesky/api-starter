import { type Context, Status } from '@oak/oak'

const sendHttpError = (ctx: Context, status: Status): void => {
  ctx.response.status = status
  ctx.response.type = undefined
}

export default sendHttpError
