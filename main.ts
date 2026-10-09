import getEnvNum from './utils/env/num.ts'
import api from './api.ts'

const port = getEnvNum('PORT', 3000)

Deno.serve({ port }, api.fetch)
