import { Router } from '@oak/oak'
import User from './model.ts'
import { isUserCreation, makeUserResponse, allUserAttributes } from './resource.ts'
import UserRepository from './repository.ts'
import getPrefix from '../../utils/get-prefix.ts'
import sendJSON from '../../utils/responses/send-json.ts'
import send400 from '../../utils/responses/send-400.ts'
import send500 from '../../utils/responses/send-500.ts'
import client from '../../client.ts'

const router = new Router({
  methods: ['POST'],
  prefix: getPrefix('users')
})

router.post('/', async ctx => {
  const { data } = await ctx.request.body.json()
  if (!isUserCreation({ data })) {
    send400(ctx)
  } else {
    const repository = new UserRepository(client)
    const user = data.attributes as User
    const saved = await repository.save(user)
    if (saved.id) {
      sendJSON(ctx, makeUserResponse(saved, allUserAttributes))
    } else {
      send500(ctx)
    }
  }
})

export default router
