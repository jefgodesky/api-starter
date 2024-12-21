import { Context, Middleware, Next } from '@oak/oak'
import { send401, send403 } from '../../utils/responses/errors.ts'

const requirePermissions = (...permissions: string[]): Middleware => {
  return async (ctx: Context, next: Next) => {
    const isAuthenticated = ctx.state.client !== undefined
    const userPermissions = ctx.state.permissions
    const permitted = permissions.every(p => userPermissions.includes(p))
    const allPermissions = userPermissions.includes('*')

    if (permitted || allPermissions) {
      await next()
    } else if (isAuthenticated) {
      send403(ctx)
    } else {
      send401(ctx)
    }
  }
}

export default requirePermissions