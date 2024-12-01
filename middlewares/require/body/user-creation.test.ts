import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext, createMockNext } from '@oak/oak/testing'
import { UserCreation } from '../../../collections/users/resource.ts'
import stringToReadableStream from '../../../utils/string-to-readable-stream.ts'
import requireUserCreationBody from './user-creation.ts'

describe('requireUserCreationBody', () => {
  it('proceeds if given a user creation object', async () => {
    const payload: UserCreation = {
      data: {
        type: 'users',
        attributes: {
          name: 'John Doe'
        }
      }
    }

    const ctx = createMockContext({
      body: stringToReadableStream(JSON.stringify(payload))
    })
    await requireUserCreationBody(ctx, createMockNext())
    expect(ctx.response.status).not.toBe(400)
  })

  it('returns 400 if not given a user creation object', async () => {
    const ctx = createMockContext({
      body: stringToReadableStream(JSON.stringify({ a: 1 }))
    })
    const next = () => Promise.resolve()
    await requireUserCreationBody(ctx, next)
    expect(ctx.response.status).toBe(400)
  })
})
