import { describe, it, expect } from 'vitest'
import { z } from '@hono/zod-openapi'
import { type ZodError } from 'zod'
import mapIssues from './map.ts'

describe('mapIssues', () => {
  it('maps Zod issues', () => {
    const schema = z.object({
      a: z.object({
        str: z.string(),
        num: z.number().min(1).max(10)
      })
    })
    const { error } = schema.safeParse({ a: { str: false, num: 42 } })
    const actual = mapIssues('json', error as ZodError)
    expect(actual).toEqual([
      {
        detail: 'Invalid input: expected string, received boolean',
        code: 'invalid_type',
        target: 'body',
        pointer: '/a/str'
      },
      {
        detail: 'Too big: expected number to be <=10',
        code: 'too_big',
        target: 'body',
        pointer: '/a/num'
      }
    ])
  })
})
