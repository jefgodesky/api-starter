import { serve } from '@hono/node-server'
import api from './api.ts'
import env from './env.ts'

serve({
  fetch: api.fetch,
  port: env.PORT
}, () => {
  const { API_PROTOCOL, API_DOMAIN, PORT } = env
  console.log(`API is running on ${API_PROTOCOL}://${API_DOMAIN}:${PORT}`)
})
