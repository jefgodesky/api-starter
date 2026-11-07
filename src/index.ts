import { serve } from '@hono/node-server'
import getRoot from './utils/strings/root.js'
import api from './api.ts'

serve({
  fetch: api.fetch,
  port: 8000
}, () => {
  console.log(`⚡ API is running at ${getRoot()}`)
})
