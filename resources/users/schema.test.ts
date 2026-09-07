import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import { UserAttributes, UserPatchBody } from './schema.ts'

const id = crypto.randomUUID()
const name = 'John Doe'

describe('UserAttributes', () => {
  it('accepts a null username', () => {
    const result = UserAttributes.safeParse({ name, username: null })
    expect(result.success).toBe(true)
  })

  it('requires username', () => {
    const result = UserAttributes.safeParse({ name })
    expect(result.success).toBe(false)
  })
})

describe('UserPatchBody', () => {
  it('accepts a partial attributes object', () => {
    const result = UserPatchBody.safeParse({
      data: { type: 'users', id, attributes: { name } },
    })
    expect(result.success).toBe(true)
  })

  it('rejects other types', () => {
    const result = UserPatchBody.safeParse({
      data: { type: 'mods', id, attributes: { name, username: null } },
    })
    expect(result.success).toBe(false)
  })
})
