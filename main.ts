import api from './api.ts'
import getEnvNumber from './utils/get-env-num.ts'

const port = getEnvNumber('PORT', 80)
Deno.serve({ port }, api.fetch)
