import { Context } from '@oak/oak'
import sendJSON from '../../utils/send-json.ts'
import userToUserResponse from '../../utils/transformers/user-to-user-response.ts'
import urlToUserFields from '../../utils/transformers/url-to-user-fields.ts'

class UserController {
  static get (ctx: Context, url?: URL) {
    const fieldSrc = url ?? ctx
    const fields = urlToUserFields(fieldSrc)
    const res = userToUserResponse(ctx.state.user, fields)
    sendJSON(ctx, res)
  }
}

export default UserController
