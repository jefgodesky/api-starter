import { afterEach, describe, it } from 'node:test'
import { expect } from '@std/expect'
import stubFetch from '../../../../utils/testing/fetch.ts'
import verifyDiscord, { DISCORD_URL } from './discord.ts'

describe('verifyDiscord', () => {
  let fetch: (() => void) | null = null

  afterEach(() => {
    fetch?.()
    fetch = null
  })

  it('returns a ProviderID for a valid token', async () => {
    fetch = stubFetch({
      [DISCORD_URL]: () => Response.json({ id: 42, name: 'John Doe' }),
    })

    expect(await verifyDiscord('good')).toEqual({
      name: 'John Doe',
      pid: '42',
    })
  })

  it('sends the token as a bearer credential', async () => {
    let auth: string | null = null
    fetch = stubFetch({
      [DISCORD_URL]: (req) => {
        auth = req.headers.get('Authorization')
        return Response.json({ id: 42, name: 'John Doe' })
      },
    })

    await verifyDiscord('good')
    expect(auth).toBe('Bearer good')
  })

  it('falls back to the login when name is null', async () => {
    fetch = stubFetch({
      [DISCORD_URL]: () => Response.json({ id: 42, name: null, login: 'jdoe' }),
    })

    expect((await verifyDiscord('good'))?.name).toBe('jdoe')
  })

  it('returns null on a 401', async () => {
    fetch = stubFetch({
      [DISCORD_URL]: () => new Response(null, { status: 401 }),
    })

    expect(await verifyDiscord('bad')).toBeNull()
  })

  it('returns null when given no ID', async () => {
    fetch = stubFetch({ [DISCORD_URL]: () => Response.json({}) })
    expect(await verifyDiscord('bad')).toBeNull()
  })
})
