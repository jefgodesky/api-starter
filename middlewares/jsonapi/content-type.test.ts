import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import createMiddlewareTest from '../../utils/testing/middleware.ts'
import localize from '../../utils/localize.ts'
import enforceJsonApiContentType from './content-type.ts'

const request = createMiddlewareTest(
  enforceJsonApiContentType,
  'Content-Type',
  'POST',
)

const expectRejection = async (res: Response) => {
  expect(res.status).toBe(415)
  expect(await res.text()).toBe(localize('jsonapi_enforce_content_type'))
}

describe('enforceJsonApiContentType', () => {
  it('proceeds if there is no Content-Type header', async () => {
    expect((await request()).status).toBe(204)
  })

  it('proceeds if given a valid Content-Type header', async () => {
    expect((await request('application/vnd.api+json')).status).toBe(204)
  })

  it('returns 415 if not given a valid Content-Type header', async () => {
    await expectRejection(await request('application/json'))
  })

  it('returns 415 if given an invalid profile', async () => {
    await expectRejection(
      await request(
        'application/vnd.api+json;profile="https://example.com/resource-timestamps"',
      ),
    )
  })

  it('returns 415 if given an invalid extension', async () => {
    await expectRejection(
      await request(
        'application/vnd.api+json;ext="https://jsonapi.org/ext/version"',
      ),
    )
  })

  it('returns 415 if given any other parameter', async () => {
    await expectRejection(
      await request('application/vnd.api+json;other="hello"'),
    )
  })
})
