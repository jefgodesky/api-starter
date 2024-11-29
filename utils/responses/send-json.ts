import { type Context, Status } from '@oak/oak'
import type { MockContext } from './send-json.test.ts'
import type { Response } from '../../jsonapi.d.ts'

const sendJSON = (ctx: Context | MockContext, content: Response): void => {
  ctx.response.status = Status.OK
  ctx.response.type = 'json'
  ctx.response.body = content
}

export default sendJSON
