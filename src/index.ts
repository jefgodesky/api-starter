import { serve } from '@hono/node-server'
import { parseIntOr } from '@revolutionarygamesco/common'
import getRoot from './utils/strings/root.js'
import api from './api.ts'
import env from './env.ts'

const { port } = new URL(env.BASE_URL)
serve({
  fetch: api.fetch,
  port: parseIntOr(port, 80)
}, () => {
  console.log(`⚡ API is running at ${getRoot()}`)
})
