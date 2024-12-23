import { Context } from '@oak/oak'
import checkExplicitPermission from './explicit.ts'

const checkUserSelfPermission = (ctx: Context, permission: string): boolean => {
  const { client, user } = ctx.state
  if (!client || !user) return false
  if (client.id !== user.id) return false
  return checkExplicitPermission(ctx, permission)
}

export default checkUserSelfPermission
