import { Hono, type MiddlewareHandler } from 'hono'

const createMiddlewareTest = (
  mw: MiddlewareHandler,
  header: string,
  method = 'GET',
) => {
  const app = new Hono()
  app.use('*', mw)
  app.on(method, '/', (c) => c.body(null, 204))
  return (value?: string): Promise<Response> | Response =>
    app.request('/', {
      method,
      headers: value ? { [header]: value } : undefined,
    })
}

export default createMiddlewareTest
