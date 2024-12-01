import { Router } from '@oak/oak'
import UserController from './controller.ts'
import getPrefix from '../../utils/get-prefix.ts'
import sendJSON from '../../utils/responses/send-json.ts'
import { send404, send500 } from '../../utils/responses/errors.ts'
import requireUserCreationBody from '../../middlewares/require/body/user-creation.ts'

const router = new Router({
  methods: ['POST'],
  prefix: getPrefix('users')
})

router.post('/', requireUserCreationBody, async ctx => {
  const body = await ctx.request.body.json()
  try {
    const user = await UserController.create(body)
    sendJSON(ctx, user)
  } catch (_) {
    send500(ctx)
  }
})

router.get('/:id', async ctx => {
  const user = await UserController.get(ctx.params.id, ctx)
  if (user) {
    sendJSON(ctx, user)
  } else {
    send404(ctx)
  }
})

export default router
