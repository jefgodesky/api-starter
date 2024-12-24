import { Context } from '@oak/oak'
import RoleRepository from './repository.ts'
import sendNoContent from '../../../utils/send-no-content.ts'

class RoleController {
  static async post (ctx: Context) {
    const { user, params } = ctx.state
    const { role } = params
    const repository = new RoleRepository()

    const check = await repository.has(user.id, role)
    if (check !== true) await repository.grant(user.id, role)
    sendNoContent(ctx)
  }
}

export default RoleController
