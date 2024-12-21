import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { HttpError, Status } from '@oak/oak'
import { createMockContext } from '@oak/oak/testing'
import createNextSpy from '../../utils/testing/create-next-spy.ts'
import requireClient from './client.ts'
import getMessage from '../../utils/get-message.ts'

describe('requireClient', () => {
  it('proceeds if there is an authenticated client user', async () => {
    const ctx = createMockContext({
      state: { client: { name: 'John Doe' } }
    })
    const next = createNextSpy()
    await requireClient(ctx, next)
    expect(next.calls).toHaveLength(1)
  })

  it('returns 401 if there is no user', async () => {
    const ctx = createMockContext()
    const next = createNextSpy()

    try {
      await requireClient(ctx, next)
      expect(0).toBe('Anonymous user should throw a 401 status error.')
    } catch (err) {
      expect((err as HttpError).message).toBe(getMessage('authentication_required'))
      expect((err as HttpError).status).toBe(Status.Unauthorized)
      expect(next.calls).toHaveLength(0)
    }
  })
})
