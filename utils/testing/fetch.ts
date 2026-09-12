type StubHandler = (req: Request) => Response | Promise<Response>

const stubFetch = (
  routes: Record<string, StubHandler>,
): () => void => {
  const original = globalThis.fetch

  globalThis.fetch = (
    input: string | URL | Request,
    init?: RequestInit,
  ): Promise<Response> => {
    const req = input instanceof Request ? input : new Request(input, init)
    const url = new URL(req.url)
    const handler = routes[`${url.origin}${url.pathname}`]
    if (!handler) return Promise.resolve(new Response(null, { status: 404 }))
    return Promise.resolve(handler(req))
  }

  return () => {
    globalThis.fetch = original
  }
}

export default stubFetch
