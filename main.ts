import getEnvNum from './src/utils/env/num.ts'
import api from './src/api.ts'

const port = getEnvNum('PORT', 3000)

Deno.serve({ port }, api.fetch)
