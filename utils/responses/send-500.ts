import { type Context, Status } from '@oak/oak'

const send500 = (ctx: Context): void => {
  ctx.response.status = Status.InternalServerError
  ctx.response.type = undefined
}

export default send500
