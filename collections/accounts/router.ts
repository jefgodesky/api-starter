import { Router } from '@oak/oak'
import Provider, { isProvider } from '../../types/provider.ts'
import AccountController from './controller.ts'
import sendJSON from '../../utils/responses/send-json.ts'
import send204 from '../../utils/responses/send-204.ts'
import { send400, send500 } from '../../utils/responses/errors.ts'
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

  if (!provider || !token) {
    send400(ctx)
    return
  }

  try {
    const res = await AccountController.create(ctx.state.client.id, provider, token)
    if (res) {
      sendJSON(ctx, res)
    } else {
      send400(ctx)
    }
  } catch (_) {
    send400(ctx)
  }
})

router.get('/', addClient, requireClient, async ctx => {
  const res = await AccountController.list(ctx.state.client.id)
  if (res) {
    sendJSON(ctx, res)
  } else {
    send500(ctx)
  }
})

router.get('/:provider', addClient, requireClient, async ctx => {
  const provider = isProvider(ctx.params.provider) ? ctx.params.provider as Provider : null
  const res = provider
    ? await AccountController.get(ctx.state.client.id, provider)
    : null
  if (res) {
    sendJSON(ctx, res)
  } else {
    send500(ctx)
  }
})

router.delete('/:provider', addClient, requireClient, async ctx => {
  const provider = isProvider(ctx.params.provider) ? ctx.params.provider as Provider : null
  const res = provider
    ? await AccountController.delete(ctx.state.client.id, provider)
    : null
  if (res) {
    send204(ctx)
  } else {
    send500(ctx)
  }
})

export default router
