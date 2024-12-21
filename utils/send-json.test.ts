import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext } from '@oak/oak/testing'
import type Response from '../types/response.ts'
import type UserResource from '../types/user-resource.ts'
import getJSONAPI from './get-jsonapi.ts'
import sendJSON from './send-json.ts'

describe('sendJSON', () => {
  it('sends a JSON response', () => {
    const ctx = createMockContext()
    const content: Response = {
      jsonapi: getJSONAPI(),
      links: { self: 'http://localhost:8001/v1/test' },
      data: {
        type: 'users',
        id: '11111111-1111-1111-1111-111111111111',
        attributes: {
          name: 'John Doe',
          username: 'john'
        }
      }
    }

    sendJSON(ctx, content)
    expect(ctx.response.status).toBe(200)
    expect(ctx.response.type).toBe('application/vnd.api+json')
    expect(((ctx.response.body as Response)!.data as UserResource).id).toBe((content.data as UserResource).id)
  })
})
