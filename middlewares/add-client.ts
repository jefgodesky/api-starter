import { Middleware } from '@oak/oak'
import { validateJWT } from '@cross/jwt'
import getJWTSecret from '../utils/get-jwt-secret.ts'
import getPermissions from '../utils/get-permissions.ts'

const addClient: Middleware = async (ctx, next) => {
  const auth = ctx.request.headers.get('Authorization')
  const jwt = auth === null || !auth.startsWith('Bearer ')
    ? null
    : auth.substring(7)
  try {
    const token = jwt === null ? null : await validateJWT(jwt, getJWTSecret(), { validateExp: true })
    if (token) ctx.state.client = token.user
    // deno-lint-ignore no-empty
  } catch {}

  ctx.state.permissions = await getPermissions(ctx.state.client)
  await next()
}

export default addClient
