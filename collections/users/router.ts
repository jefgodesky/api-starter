import { Router } from '@oak/oak'
import UserController from './controller.ts'
import loadClient from '../../middlewares/load/client.ts'
import loadResource from '../../middlewares/load/resource.ts'
import requireClient from '../../middlewares/require/client.ts'
import requirePermissions from '../../middlewares/require/permissions.ts'
import requireUser from '../../middlewares/require/resources/user.ts'
import getPrefix from '../../utils/get-prefix.ts'

const router = new Router({
  prefix: getPrefix('users')
})

router.get('/:userId',
  loadResource,
  requireUser,
  ctx => {
    UserController.get(ctx)
  })

router.patch('/:userId',
  loadClient,
  requireClient,
  loadResource,
  requireUser,
  requirePermissions('user:update'),
  async (ctx) => {
    await UserController.patch(ctx)
  })

for (const route of router.keys()) {
  console.log(`${route.path} [${route.methods.join(", ")}]`);
}

const allowed = router.allowedMethods({ throw: false })
console.log(`[DEBUG] Allowed methods for UserRouter:`, allowed)

export default router
