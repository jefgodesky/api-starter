import { serve } from '@hono/node-server'
import getRoot from './utils/strings/root.js'
import api from './api.ts'
import env from './env.ts'

serve({
  fetch: api.fetch,
  port: env.PORT
}, () => {
  console.log(`⚡ API is running at ${getRoot()}`)
})
