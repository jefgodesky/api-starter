import { Hono } from 'hono'

const api = new Hono()

api.get('/', (c) => c.text('Hello, world!'))

export default api
