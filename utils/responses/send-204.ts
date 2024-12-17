import { type Context, Status } from '@oak/oak'

const send204 = (ctx: Context): void => {
  ctx.response.status = Status.NoContent
  ctx.response.type = undefined
}

export default send204
