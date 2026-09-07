import { Hono, type MiddlewareHandler } from 'hono'

const createMiddlewareTest = (
  mw: MiddlewareHandler,
  header: string,
  method: string = 'GET',
  url: URL = new URL('https://example.com/v1/test'),
) => {
  const app = new Hono()
  app.use('*', mw)
  app.on(method, url.pathname, (c) => c.body(null, 204))
  return (value?: string): Promise<Response> | Response =>
    app.request(url.toString(), {
      method,
      headers: value ? { [header]: value } : undefined,
    })
}

export default createMiddlewareTest
