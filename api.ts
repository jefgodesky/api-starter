import { Application } from '@oak/oak'

import DB from './DB.ts'
import isTest from './utils/is-test.ts'

import UserRouter from './collections/users/router.ts'
import Swagger from './middlewares/swagger.ts'

const api = new Application()

const routers = [
  UserRouter,
  Swagger
]

for (const router of routers) {
  api.use(router.routes())
  api.use(router.allowedMethods())
}

api.addEventListener('listen', ({ hostname, port, secure }) => {
  const protocol = secure ? 'https' : 'http'
  const url = `${protocol}://${hostname ?? 'localhost'}:${port}`
  if (!isTest()) console.log(`⚡ Listening on ${url}`)
})

api.addEventListener('close', async () => {
  await DB.close()
})

export default api
