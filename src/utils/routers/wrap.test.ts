import { describe, beforeEach, it, expect } from 'vitest'
import { OpenAPIHono } from '@hono/zod-openapi'
import { type RouterSub } from './types.js'
import wrapRouter from './wrap.ts'

describe('wrapRouter', () => {
  const resource = 'test'
  const path = `/${resource}`
  let hono: OpenAPIHono<RouterSub>

  beforeEach(() => {
    hono = new OpenAPIHono<RouterSub>({ strict: false }).basePath(path)
  })

  it('adds the resource to the router', () => {
    const router = wrapRouter(resource, hono)
    expect(router.resource).toBe(resource)
  })

  it('adds the path to the router', () => {
    const router = wrapRouter(resource, hono)
    expect(router.path).toBe(path)
  })
})
