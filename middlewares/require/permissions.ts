import { Context, Middleware, Next, Status, createHttpError } from '@oak/oak'
import getMessage from '../../utils/get-message.ts'

const requirePermissions = (...permissions: string[]): Middleware => {
  return async (ctx: Context, next: Next) => {
    const isAuthenticated = ctx.state.client !== undefined
    const userPermissions = ctx.state.permissions
    const permitted = permissions.every(p => userPermissions.includes(p))
    const allPermissions = userPermissions.includes('*')

    if (permitted || allPermissions) {
      await next()
    } else if (isAuthenticated) {
      throw createHttpError(Status.Forbidden, getMessage('lack_permissions'))
    } else {
      throw createHttpError(Status.Unauthorized, getMessage('authentication_required'))
    }
  }
}

export default requirePermissions
