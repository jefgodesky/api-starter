import { Router } from '@oak/oak'
import UserController from './controller.ts'
import loadResource from '../../middlewares/load/resource.ts'
import requireUser from '../../middlewares/require/resources/user.ts'
import getPrefix from '../../utils/get-prefix.ts'

const router = new Router({
  prefix: getPrefix('users')
})

router.get('/:userId', loadResource, requireUser, ctx => {
  UserController.get(ctx)
})

export default router
