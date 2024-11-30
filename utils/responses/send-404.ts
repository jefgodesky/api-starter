import { type Context, Status } from '@oak/oak'

const send404 = (ctx: Context): void => {
  ctx.response.status = Status.NotFound
  ctx.response.type = undefined
}

export default send404
