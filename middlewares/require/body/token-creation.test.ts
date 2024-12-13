import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext, createMockNext } from '@oak/oak/testing'
import type TokenCreation from '../../../types/token-creation.ts'
import stringToReadableStream from '../../../utils/transformers/string-to-readable-stream.ts'
import requireTokenCreationBody from './token-creation.ts'

describe('requireTokenCreationBody', () => {
  it('proceeds if given a token creation object', async () => {
    const payload: TokenCreation = {
      data: {
        type: 'tokens',
        attributes: {
          token: 'nope'
        }
      }
    }

    const ctx = createMockContext({
      body: stringToReadableStream(JSON.stringify(payload))
    })
    await requireTokenCreationBody(ctx, createMockNext())
    expect(ctx.response.status).not.toBe(400)
  })

  it('returns 400 if not given a user creation object', async () => {
    const ctx = createMockContext({
      body: stringToReadableStream(JSON.stringify({ a: 1 }))
    })
    const next = () => Promise.resolve()
    await requireTokenCreationBody(ctx, next)
    expect(ctx.response.status).toBe(400)
  })
})
