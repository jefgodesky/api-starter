import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import createMiddlewareTest from '../../utils/testing/middleware.ts'
import localize from '../../utils/localize.ts'
import enforceJsonApiContentType from './content-type.ts'

const tester = createMiddlewareTest(enforceJsonApiContentType)

const expectRejection = async (res: Response) => {
  expect(res.status).toBe(415)
  expect(await res.text()).toBe(localize('jsonapi_enforce_content_type'))
}

describe('enforceJsonApiContentType', () => {
  it('proceeds if there is no Content-Type header', async () => {
    const { res } = await tester()
    expect(res.status).toBe(204)
  })

  it('proceeds if given a valid Content-Type header', async () => {
    const header = '*/*'
    const req = { headers: { 'Content-Type': header } }
    const { res } = await tester(req)
    expect(res.status).toBe(204)
  })

  it('returns 415 if not given a valid Content-Type header', async () => {
    const header = 'application/json'
    const req = { headers: { 'Content-Type': header } }
    const { res } = await tester(req)
    await expectRejection(res)
  })

  it('returns 415 if given an invalid profile', async () => {
    const header =
      'application/vnd.api+json;profile="https://example.com/resource-timestamps"'
    const req = { headers: { 'Content-Type': header } }
    const { res } = await tester(req)
    await expectRejection(res)
  })

  it('returns 415 if given an invalid extension', async () => {
    const header =
      'application/vnd.api+json;ext="https://jsonapi.org/ext/version"'
    const req = { headers: { 'Content-Type': header } }
    const { res } = await tester(req)
    await expectRejection(res)
  })

  it('returns 415 if given any other parameter', async () => {
    const header = 'application/vnd.api+json;other="hello"'
    const req = { headers: { 'Content-Type': header } }
    const { res } = await tester(req)
    await expectRejection(res)
  })
})
