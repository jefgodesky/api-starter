import { type Context, Status } from '@oak/oak'
import type { MockContext } from '../../tests.d.ts'

const send400 = (ctx: Context | MockContext): void => {
  ctx.response.status = Status.BadRequest
  ctx.response.type = undefined
}

export default send400
