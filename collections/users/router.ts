import { Router } from '@oak/oak'
import UserController from './controller.ts'
import getPrefix from '../../utils/get-prefix.ts'
import sendJSON from '../../utils/responses/send-json.ts'
import { send404 } from '../../utils/responses/errors.ts'

const router = new Router({
  prefix: getPrefix('users')
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
