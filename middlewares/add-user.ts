import { Middleware } from '@oak/oak'
import { validateJWT } from '@cross/jwt'
import getJWTSecret from '../utils/get-jwt-secret.ts'
import getPermissions from '../utils/get-permissions.ts'

const addUser: Middleware = async (ctx, next) => {
  const auth = ctx.request.headers.get('Authorization')
  const jwt = auth === null || !auth.startsWith('Bearer ')
    ? null
    : auth.substring(7)
  try {
    const token = jwt === null ? null : await validateJWT(jwt, getJWTSecret(), { validateExp: true })
    if (token) ctx.state.user = token.user
  // deno-lint-ignore no-empty
  } catch {}

  ctx.state.permissions = await getPermissions(ctx.state.user)
  await next()
}

export default addUser
