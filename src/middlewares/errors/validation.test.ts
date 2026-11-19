import { describe, it, expect } from 'vitest'
import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { z } from '@hono/zod-openapi'
import { StatusCodes } from 'http-status-codes'
import defaultZodHook from './validation.ts'

describe('defaultZodHook', () => {
  const path = '/v1/tests'
  const uri = `http://localhost${path}`
  const c = new Context(new Request(uri), { env: {}, path })
  const schema = z.object({ str: z.string() })

  it('returns undefined if validation succeeds', () => {
    const { data } = schema.safeParse({ str: 'Hello, world!' })
    expect(defaultZodHook({ success: true, data, target: 'json' }, c)).toBeUndefined()
  })

  it('throws an HTTPException if validation fails', () => {
    const msg = 'Validation is supposed to fail'
    const result = schema.safeParse({ str: false })
    if (result.success) throw new Error(msg)

    try {
      defaultZodHook({ success: false, error: result.error, target: 'json' }, c)
      expect.unreachable(msg)
    } catch (err) {
      expect(err).toBeInstanceOf(HTTPException)
      const { status, message } = err as HTTPException
      expect(status).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(message).toBe('validation')
    }
  })
})
