import { Router } from '@oak/oak'
import UserController from './controller.ts'
import addResource from '../../middlewares/add-resource.ts'
import requireUser from '../../middlewares/require/resources/user.ts'
import getPrefix from '../../utils/get-prefix.ts'

const router = new Router({
  prefix: getPrefix('users')
})

router.get('/:userId', addResource, requireUser, ctx => {
  UserController.get(ctx)
})

export default router
