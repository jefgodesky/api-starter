import { Application, type Router } from "@oak/oak"

import UserRouter from './collections/users/router.ts'

import getEnvNumber from './utils/get-env-number.ts'

const api = new Application()
const port = getEnvNumber('PORT', 80)

const routers = [
  UserRouter
]

for (const router of routers) {
  api.use(router.routes())
  api.use(router.allowedMethods())
}

api.addEventListener('listen', ({ hostname, port, secure }) => {
  const protocol = secure ? 'https' : 'http'
  const url = `${protocol}://${hostname ?? 'localhost'}:${port}`
  console.log(`⚡ Listening on ${url}`,
  );
});

await api.listen({ port })
