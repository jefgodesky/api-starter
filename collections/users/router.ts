import * as uuid from '@std/uuid'
import { Router } from '@oak/oak'
import User from './model.ts'
import {
  isUserCreation,
  makeUserResponse,
  allUserAttributes,
  getUserFields
} from './resource.ts'
import UserRepository from './repository.ts'
import getPrefix from '../../utils/get-prefix.ts'
import sendJSON from '../../utils/responses/send-json.ts'
import { send400, send404, send500 } from '../../utils/responses/errors.ts'

const repository = new UserRepository()
const router = new Router({
  methods: ['POST'],
  prefix: getPrefix('users')
})

router.post('/', async ctx => {
  const { data } = await ctx.request.body.json()
  if (!isUserCreation({ data })) {
    send400(ctx)
  } else {
    const user = data.attributes as User
    const saved = await repository.save(user)
    if (saved.id) {
      sendJSON(ctx, makeUserResponse(saved, allUserAttributes))
    } else {
      send500(ctx)
    }
  }
})

router.get('/:id', async ctx => {
  const { id } = ctx.params
  const user = uuid.v4.validate(id)
    ? await repository.get(id)
    : await repository.getByUsername(id)

  if (!user) {
    send404(ctx)
  } else {
    sendJSON(ctx, makeUserResponse(user, getUserFields(ctx)))
  }
})

export default router
