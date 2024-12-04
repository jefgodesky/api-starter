import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createMockContext, createMockNext } from '@oak/oak/testing'
import enforceJsonApiAccept from './accept.ts'

describe('enforceJsonApiAccept', () => {
  it('proceeds if there is no Accept header', async () => {
    const ctx = createMockContext()
    await enforceJsonApiAccept(ctx, createMockNext())
    expect(ctx.response.status).not.toBe(406)
  })

  it('proceeds if the Accept header is */*', async () => {
    const ctx = createMockContext({
      headers: [
        ['Accept', '*/*']
      ]
    })
    await enforceJsonApiAccept(ctx, createMockNext())
    expect(ctx.response.status).not.toBe(406)
  })

  it('proceeds if the Accept header contains */*', async () => {
    const ctx = createMockContext({
      headers: [
        ['Accept', '*/*, application/json']
      ]
    })
    await enforceJsonApiAccept(ctx, createMockNext())
    expect(ctx.response.status).not.toBe(406)
  })

  it('proceeds if the Accept header is valid type', async () => {
    const ctx = createMockContext({
      headers: [
        ['Accept', 'application/vnd.api+json'],
      ]
    })
    await enforceJsonApiAccept(ctx, createMockNext())
    expect(ctx.response.status).not.toBe(406)
  })

  it('proceeds if the Accept header contains valid type', async () => {
    const ctx = createMockContext({
      headers: [
        ['Accept', 'application/json, application/vnd.api+json'],
      ]
    })
    await enforceJsonApiAccept(ctx, createMockNext())
    expect(ctx.response.status).not.toBe(406)
  })

  it('returns 406 if not given a valid Accept type', async () => {
    const ctx = createMockContext({
      headers: [
        ['Accept', 'application/json'],
      ]
    })
    await enforceJsonApiAccept(ctx, createMockNext())
    expect(ctx.response.status).toBe(406)
  })

  it('returns 406 if given an invalid profile', async () => {
    const ctx = createMockContext({
      headers: [
        ['Accept', 'application/vnd.api+json;profile="https://example.com/resource-timestamps"'],
      ]
    })
    await enforceJsonApiAccept(ctx, createMockNext())
    expect(ctx.response.status).toBe(406)
  })

  it('returns 406 if given an invalid extension', async () => {
    const ctx = createMockContext({
      headers: [
        ['Accept', 'application/vnd.api+json;ext="https://jsonapi.org/ext/version"'],
      ]
    })
    await enforceJsonApiAccept(ctx, createMockNext())
    expect(ctx.response.status).toBe(406)
  })

  it('returns 406 if given any other parameter', async () => {
    const ctx = createMockContext({
      headers: [
        ['Accept', 'application/vnd.api+json;other="hello"'],
      ]
    })
    await enforceJsonApiAccept(ctx, createMockNext())
    expect(ctx.response.status).toBe(406)
  })

  it('proceeds if any Accept type is valid', async () => {
    const ctx = createMockContext({
      headers: [
        ['Accept', 'application/json, application/vnd.api+json;other="hello", application/vnd.api+json'],
      ]
    })
    await enforceJsonApiAccept(ctx, createMockNext())
    expect(ctx.response.status).not.toBe(406)
  })
})
