import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type { Response } from '../../jsonapi.d.ts'
import getJSONAPI from '../get-jsonapi.ts'
import sendJSON from './send-json.ts'

export type MockContext = {
  response: {
    body?: any
    status?: number
    type?: string
  }
}

describe('sendJSON', () => {
  it('sends a JSON response', () => {
    const ctx: MockContext = { response: {} }
    const content: Response = {
      jsonapi: getJSONAPI(),
      links: { self: 'http://localhost:8001/v1/test' },
      data: [{
        type: 'users',
        id: '11111111-1111-1111-1111-111111111111',
        attributes: {
          name: 'John Doe',
          username: 'john'
        }
      }]
    }

    sendJSON(ctx, content)
    expect(ctx.response.status).toBe(200)
    expect(ctx.response.type).toBe('json')
    expect(ctx.response.body.data[0].id).toBe(content.data[0].id)
  })
})
