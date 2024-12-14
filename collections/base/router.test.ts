import { describe, beforeAll, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import DB from '../../DB.ts'
import { type RouterTest, setupRouterTest, closeRouterTest } from '../../utils/testing/setup-router-test.ts'
import getRoot from '../../utils/get-root.ts'

describe('/', () => {
  let test: RouterTest

  beforeAll(async () => {
    test = await setupRouterTest()
  })

  afterEach(async () => {
    await DB.clear()
  })

  afterAll(() => {
    closeRouterTest(test)
  })

  describe('Root [/]', () => {
    describe('GET', () => {
      it('returns a directory of available endpoints', async () => {
        const res = await supertest(getRoot())
          .get('/')

        expect(res.status).toBe(200)
        expect(res.body.links.self).toBe(getRoot())
        expect(res.body.links.describedBy).toBe(getRoot() + '/docs')
        expect(res.body.links.users).toBe(getRoot() + '/users')
      })
    })
  })
})
