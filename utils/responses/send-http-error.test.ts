import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { Status } from '@oak/oak'
import { createMockContext } from '@oak/oak/testing'
import sendHttpError from './send-http-error.ts'

describe('sendHttpError', () => {
  it('sends the specified error response', () => {
    const ctx = createMockContext()
    sendHttpError(ctx, Status.NotFound)
    expect(ctx.response.status).toBe(Status.NotFound)
    expect(ctx.response.type).not.toBeDefined()
  })
})
