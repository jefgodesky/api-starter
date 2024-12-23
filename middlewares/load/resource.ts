import { Middleware } from '@oak/oak'
import loadUser from './user.ts'

const loadResource: Middleware = async (ctx, next) => {
  if (ctx.state.params?.userId) {
    await loadUser(ctx, async () => {})
  }

  await next()
}

export default loadResource
