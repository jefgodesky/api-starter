import { type Context, type Env, Hono, type MiddlewareHandler } from 'hono'

interface TestRequest {
  method?: string
  path?: string
  headers?: Record<string, string>
  body?: BodyInit
}

interface TestResult<E extends Env> {
  res: Response
  context: Context<E> | undefined
}

const createMiddlewareTest = <E extends Env = Env>(
  middlewares: MiddlewareHandler<E> | MiddlewareHandler<E>[],
  request: TestRequest = {},
) => {
  const stack = Array.isArray(middlewares) ? middlewares : [middlewares]

  return async (req: TestRequest = {}): Promise<TestResult<E>> => {
    let context: Context<E> | undefined
    const app = new Hono<E>()
    app.use('*', ...stack)
    app.all('*', (c) => {
      context = c
      return c.body(null, 204)
    })

    const res = await app.request(req.path ?? request.path ?? '/', {
      method: req.method ?? request.method ?? 'GET',
      headers: { ...request.headers, ...req.headers },
      body: req.body ?? request.body,
    })

    return { res, context }
  }
}

export default createMiddlewareTest
