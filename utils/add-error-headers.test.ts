import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { Status } from '@oak/oak'
import { createMockContext } from '@oak/oak/testing'
import addErrorHeaders from './add-error-headers.ts'

describe('addErrorHeaders', () => {
  it('adds WWW-Authenticate to 401', () => {
    const ctx = createMockContext()
    ctx.response.status = Status.Unauthorized
    addErrorHeaders(ctx)
    expect(ctx.response.headers.get('WWW-Authenticate')).toBe('Bearer')
  })
})
