import { afterEach, describe, it } from 'node:test'
import { expect } from '@std/expect'
import stubFetch from '../../../../utils/testing/fetch.ts'
import verifyGitHub, { GITHUB_URL } from './github.ts'

describe('verifyGitHub', () => {
  let fetch: (() => void) | null = null

  afterEach(() => {
    fetch?.()
    fetch = null
  })

  it('returns a ProviderID for a valid token', async () => {
    fetch = stubFetch({
      [GITHUB_URL]: () => Response.json({ id: 42, name: 'John Doe' }),
    })

    expect(await verifyGitHub('good')).toEqual({
      name: 'John Doe',
      pid: '42',
    })
  })

  it('sends the token as a bearer credential', async () => {
    let auth: string | null = null
    fetch = stubFetch({
      [GITHUB_URL]: (req) => {
        auth = req.headers.get('Authorization')
        return Response.json({ id: 42, name: 'John Doe' })
      },
    })

    await verifyGitHub('good')
    expect(auth).toBe('Bearer good')
  })

  it('falls back to the login when name is null', async () => {
    fetch = stubFetch({
      [GITHUB_URL]: () => Response.json({ id: 42, name: null, login: 'jdoe' }),
    })

    expect((await verifyGitHub('good'))?.name).toBe('jdoe')
  })

  it('returns null on a 401', async () => {
    fetch = stubFetch({
      [GITHUB_URL]: () => new Response(null, { status: 401 }),
    })

    expect(await verifyGitHub('bad')).toBeNull()
  })

  it('returns null when given no ID', async () => {
    fetch = stubFetch({ [GITHUB_URL]: () => Response.json({}) })
    expect(await verifyGitHub('bad')).toBeNull()
  })
})
