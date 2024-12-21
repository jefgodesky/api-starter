import { Router, Status, createHttpError } from '@oak/oak'
import Provider, { isProvider } from '../../types/provider.ts'
import AccountController from './controller.ts'
import sendJSON from '../../utils/responses/send-json.ts'
import getMessage from '../../utils/get-message.ts'
import getPrefix from '../../utils/get-prefix.ts'
import addClient from '../../middlewares/add-client.ts'
import requireClient from '../../middlewares/require/client.ts'
import requireTokenCreationBody from '../../middlewares/require/body/token-creation.ts'

const router = new Router({
  prefix: getPrefix('accounts')
})

router.post('/', addClient, requireClient, requireTokenCreationBody, async ctx => {
  const body = await ctx.request.body.json()
  const { provider, token } = body.data.attributes
  const err = createHttpError(Status.BadRequest, getMessage('invalid_account_post'))
  if (!provider || !token) throw err

  const res = await AccountController.create(ctx.state.client.id, provider, token)
  if (!res) throw err
  sendJSON(ctx, res)
})

router.get('/', addClient, requireClient, async ctx => {
  const res = await AccountController.list(ctx.state.client.id)
  if (!res) throw createHttpError(Status.InternalServerError)
  sendJSON(ctx, res)
})

router.get('/:provider', addClient, requireClient, async ctx => {
  const provider = isProvider(ctx.params.provider) ? ctx.params.provider as Provider : null
  const res = provider
    ? await AccountController.get(ctx.state.client.id, provider)
    : null
  if (!res) throw createHttpError(Status.InternalServerError)
  sendJSON(ctx, res)
})

router.delete('/:provider', addClient, requireClient, async ctx => {
  const provider = isProvider(ctx.params.provider) ? ctx.params.provider as Provider : null
  const res = provider
    ? await AccountController.delete(ctx.state.client.id, provider)
    : null
  if (!res) throw createHttpError(Status.InternalServerError)

  ctx.response.status = Status.NoContent
  ctx.response.type = undefined
})

export default router
