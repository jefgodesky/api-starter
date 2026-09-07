import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import createMiddlewareTest from '../../utils/testing/middleware.ts'
import localize from '../../utils/localize.ts'
import enforceJsonApiAccept from './accept.ts'

const request = createMiddlewareTest(enforceJsonApiAccept, 'Accept')

const expectRejection = async (res: Response) => {
  expect(res.status).toBe(406)
  expect(await res.text()).toBe(localize('jsonapi_enforce_accept'))
}

describe('enforceJsonApiAccept', () => {
  it('proceeds if there is no Accept header', async () => {
    expect((await request()).status).toBe(204)
  })

  it('proceeds if the Accept header is */*', async () => {
    expect((await request('*/*')).status).toBe(204)
  })

  it('proceeds if the Accept header contains */*', async () => {
    expect((await request('*/*, application/json')).status).toBe(204)
  })

  it('proceeds if the Accept header is valid type', async () => {
    expect((await request('application/vnd.api+json')).status).toBe(204)
  })

  it('proceeds if the Accept header contains valid type', async () => {
    const res = await request('application/json, application/vnd.api+json')
    expect(res.status).toBe(204)
  })

  it('returns 406 if not given a valid Accept type', async () => {
    await expectRejection(await request('application/json'))
  })

  it('returns 406 if given an invalid profile', async () => {
    await expectRejection(
      await request(
        'application/vnd.api+json;profile="https://example.com/resource-timestamps"',
      ),
    )
  })

  it('returns 406 if given an invalid extension', async () => {
    await expectRejection(
      await request(
        'application/vnd.api+json;ext="https://jsonapi.org/ext/version"',
      ),
    )
  })

  it('returns 406 if given any other parameter', async () => {
    await expectRejection(
      await request('application/vnd.api+json;other="hello"'),
    )
  })

  it('proceeds if any Accept type is valid', async () => {
    const res = await request(
      'application/json, application/vnd.api+json;other="hello", application/vnd.api+json',
    )
    expect(res.status).toBe(204)
  })
})
