import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import createMiddlewareTest from '../../utils/testing/middleware.ts'
import localize from '../../utils/localize.ts'
import enforceJsonApiAccept from './accept.ts'

const tester = createMiddlewareTest(enforceJsonApiAccept)

const expectRejection = async (res: Response) => {
  expect(res.status).toBe(406)
  expect(await res.text()).toBe(localize('jsonapi_enforce_accept'))
}

describe('enforceJsonApiAccept', () => {
  it('proceeds if there is no Accept header', async () => {
    const { res } = await tester()
    expect(res.status).toBe(204)
  })

  it('proceeds if the Accept header is */*', async () => {
    const headers = { headers: { Accept: '*/*' } }
    const { res } = await tester(headers)
    expect(res.status).toBe(204)
  })

  it('proceeds if the Accept header contains */*', async () => {
    const Accept = '*/*, application/json'
    const headers = { headers: { Accept } }
    const { res } = await tester(headers)
    expect(res.status).toBe(204)
  })

  it('proceeds if the Accept header is valid type', async () => {
    const Accept = 'application/vnd.api+json'
    const headers = { headers: { Accept } }
    const { res } = await tester(headers)
    expect(res.status).toBe(204)
  })

  it('proceeds if the Accept header contains valid type', async () => {
    const Accept = 'application/json, application/vnd.api+json'
    const headers = { headers: { Accept } }
    const { res } = await tester(headers)
    expect(res.status).toBe(204)
  })

  it('returns 406 if not given a valid Accept type', async () => {
    const Accept = 'application/json'
    const headers = { headers: { Accept } }
    const { res } = await tester(headers)
    await expectRejection(res)
  })

  it('returns 406 if given an invalid profile', async () => {
    const Accept =
      'application/vnd.api+json;profile="https://example.com/resource-timestamps"'
    const headers = { headers: { Accept } }
    const { res } = await tester(headers)
    await expectRejection(res)
  })

  it('returns 406 if given an invalid extension', async () => {
    const Accept =
      'application/vnd.api+json;ext="https://jsonapi.org/ext/version"'
    const headers = { headers: { Accept } }
    const { res } = await tester(headers)
    await expectRejection(res)
  })

  it('returns 406 if given any other parameter', async () => {
    const Accept = 'application/vnd.api+json;other="hello"'
    const headers = { headers: { Accept } }
    const { res } = await tester(headers)
    await expectRejection(res)
  })

  it('proceeds if any Accept type is valid', async () => {
    const Accept =
      'application/json, application/vnd.api+json;other="hello", application/vnd.api+json'
    const headers = { headers: { Accept } }
    const { res } = await tester(headers)
    expect(res.status).toBe(204)
  })
})
