import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import type { Router } from '@oak/oak'
import UserRouter from '../users/router.ts'
import {
  getEndpoints
} from './resource.ts'

describe('RootResource methods', () => {
  const routers: Record<string, Router> = { users: UserRouter }

  describe('getEndpoints', () => {
    it('creates a link object with endpoints', () => {
      const expected = {
        self: 'http://localhost:8001/v1',
        describedBy: 'http://localhost:8001/v1/docs',
        users: 'http://localhost:8001/v1/users'
      }
      expect(getEndpoints(routers)).toEqual(expected)
    })
  })
})
