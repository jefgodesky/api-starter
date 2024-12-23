import { Router, Status, createHttpError } from '@oak/oak'
import Provider, { isProvider } from '../../types/provider.ts'
import AccountController from './controller.ts'
import sendJSON from '../../utils/send-json.ts'
import getPrefix from '../../utils/get-prefix.ts'
import loadClient from '../../middlewares/load/client.ts'
import requireClient from '../../middlewares/require/client.ts'
import requireAccountCreationBody from '../../middlewares/require/body/account-creation.ts'

const router = new Router({
  prefix: getPrefix('accounts')
})

router.post('/', loadClient, requireClient, requireAccountCreationBody, async ctx => {
  await AccountController.create(ctx)
})

router.get('/', loadClient, requireClient, async ctx => {
  await AccountController.list(ctx)
})

router.get('/:provider', loadClient, requireClient, async ctx => {
  const provider = isProvider(ctx.params.provider) ? ctx.params.provider as Provider : null
  const res = provider
    ? await AccountController.get(ctx.state.client.id, provider)
    : null
  if (!res) throw createHttpError(Status.InternalServerError)
  sendJSON(ctx, res)
})

router.delete('/:provider', loadClient, requireClient, async ctx => {
  const provider = isProvider(ctx.params.provider) ? ctx.params.provider as Provider : null
  const res = provider
    ? await AccountController.delete(ctx.state.client.id, provider)
    : null
  if (!res) throw createHttpError(Status.InternalServerError)

  ctx.response.status = Status.NoContent
  ctx.response.type = undefined
})

export default router
