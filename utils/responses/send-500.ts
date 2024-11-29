import { type Context, Status } from '@oak/oak'
import type { MockContext } from '../../tests.d.ts'

const send500 = (ctx: Context | MockContext): void => {
  ctx.response.status = Status.InternalServerError
  ctx.response.type = undefined
}

export default send500
