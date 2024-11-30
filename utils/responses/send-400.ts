import { type Context, Status } from '@oak/oak'

const send400 = (ctx: Context): void => {
  ctx.response.status = Status.BadRequest
  ctx.response.type = undefined
}

export default send400
