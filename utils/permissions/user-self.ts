import { Context } from '@oak/oak'
import checkExplicitPermission from './explicit.ts'

const checkUserSelfPermission = (ctx: Context, permission: string): boolean => {
  const isSelf = ctx.state.client !== undefined && ctx.state.client.id === ctx.state.user?.id
  const selfVersion = permission.replace('user:', 'user:self:')
  return isSelf && checkExplicitPermission(ctx, selfVersion)
}

export default checkUserSelfPermission
