import { Context } from '@oak/oak'
import UserRepository from './repository.ts'
import sendJSON from '../../utils/send-json.ts'
import sendNoContent from '../../utils/send-no-content.ts'
import userToUserResponse from '../../utils/transformers/user-to-user-response.ts'
import urlToUserFields from '../../utils/transformers/url-to-user-fields.ts'

class UserController {
  static get (ctx: Context, url?: URL) {
    const fieldSrc = url ?? ctx
    const fields = urlToUserFields(fieldSrc)
    const res = userToUserResponse(ctx.state.user, fields)
    sendJSON(ctx, res)
  }

  static async patch (ctx: Context) {
    const body = await ctx.request.body.json()
    const { attributes } = body.data
    const { user } = ctx.state

    if ('name' in attributes) user.name = attributes.name
    if ('username' in attributes) user.username = attributes.username

    const users = new UserRepository()
    await users.save(user)

    const res = userToUserResponse(user)
    sendJSON(ctx, res)
  }

  static async destroy (ctx: Context) {
    const users = new UserRepository()
    await users.delete(ctx.state.user.id)
    sendNoContent(ctx)
  }
}

export default UserController
