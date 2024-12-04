import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext, createMockNext } from '@oak/oak/testing'
import enforceJsonApiContentType from './content-type.ts'

describe('enforceJsonApiContentType', () => {
  it('proceeds if there is no Content-Type header', async () => {
    const ctx = createMockContext()
    await enforceJsonApiContentType(ctx, createMockNext())
    expect(ctx.response.status).not.toBe(415)
  })

  it('proceeds if given a valid Content-Type header', async () => {
    const ctx = createMockContext({
      headers: [
        ['Content-Type', 'application/vnd.api+json'],
      ]
    })
    await enforceJsonApiContentType(ctx, createMockNext())
    expect(ctx.response.status).not.toBe(415)
  })

  it('returns 415 if not given a valid Content-Type header', async () => {
    const ctx = createMockContext({
      headers: [
        ['Content-Type', 'application/json'],
      ]
    })
    await enforceJsonApiContentType(ctx, createMockNext())
    expect(ctx.response.status).toBe(415)
  })

  it('returns 415 if given an invalid profile', async () => {
    const ctx = createMockContext({
      headers: [
        ['Content-Type', 'application/vnd.api+json;profile="https://example.com/resource-timestamps"'],
      ]
    })
    await enforceJsonApiContentType(ctx, createMockNext())
    expect(ctx.response.status).toBe(415)
  })

  it('returns 415 if given an invalid extension', async () => {
    const ctx = createMockContext({
      headers: [
        ['Content-Type', 'application/vnd.api+json;ext="https://jsonapi.org/ext/version"'],
      ]
    })
    await enforceJsonApiContentType(ctx, createMockNext())
    expect(ctx.response.status).toBe(415)
  })

  it('returns 415 if given any other parameter', async () => {
    const ctx = createMockContext({
      headers: [
        ['Content-Type', 'application/vnd.api+json;other="hello"'],
      ]
    })
    await enforceJsonApiContentType(ctx, createMockNext())
    expect(ctx.response.status).toBe(415)
  })
})
