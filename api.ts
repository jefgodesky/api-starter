import { Hono } from 'hono'
import getEnvNumber from './utils/get-env-num.ts'

const v = getEnvNumber('API_VERSION', 1)
const api = new Hono().basePath(`v${v}`)

api.get('/', (c) => c.text('Hello, world!'))

export default api
