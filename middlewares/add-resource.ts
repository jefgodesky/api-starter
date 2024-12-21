import { Middleware } from '@oak/oak'
import UserRepository from '../collections/users/repository.ts'

const addResource: Middleware = async (ctx, next) => {
  if (ctx.state.params?.userId) {
    const users = new UserRepository()
    ctx.state.user = await users.getByIdOrUsername(ctx.state.params.userId)
  }

  await next()
}

export default addResource
