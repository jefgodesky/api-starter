import { describe, it } from 'node:test'
import { expect } from '@std/expect'
import { type Context } from 'hono'
import { z } from '@hono/zod-openapi'
import { UserPatchBody } from '../../resources/users/schema.ts'
import defaultHook from './hook.ts'

const stub = {
  json: (body: unknown, status: number) => ({ body, status }),
} as unknown as Context

type Out = {
  body: { errors: Array<{ source: { pointer: string } }> }
  status: number
} | undefined

const Schema = z.object({ name: z.string(), email: z.string() })
const ParamSchema = z.object({ id: z.uuidv4() })

const run = (
  result: Parameters<typeof defaultHook>[0],
) => defaultHook(result, stub) as Out

const paramFail = (
  params: unknown,
) => ({
  ...ParamSchema.safeParse(params),
  target: 'param' as const,
})

const bodyFail = (
  body: unknown,
) => ({
  ...UserPatchBody.safeParse(body),
  target: 'json' as const,
})

const schemaFail = (
  input: unknown,
) => ({
  ...Schema.safeParse(input),
  target: 'json' as const,
})

describe('defaultHook', () => {
  it('proceeds with valid body', () => {
    const body = { name: 'John Doe', email: 'john@example.com' }
    expect(run(schemaFail(body))).toBeUndefined()
  })

  it('returns 400 for invalid property', () => {
    const body = { id: 'not-a-uuid' }
    expect(run(paramFail(body))?.status).toBe(400)
  })

  it('returns 422 for invalid body', () => {
    const data = { type: 'admins', id: crypto.randomUUID(), attributes: {} }
    expect(run(bodyFail({ data }))?.status).toBe(422)
  })

  it('explains which field failed', () => {
    const actual = run(schemaFail({ name: 'John Doe' }))
    expect(actual?.body.errors[0].source.pointer).toBe('/email')
  })

  it('explains each issue', () => {
    const actual = run(schemaFail({}))
    expect(actual?.body.errors).toHaveLength(2)
  })
})
