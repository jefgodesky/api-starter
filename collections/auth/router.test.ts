import { describe, beforeAll, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import DB from '../../DB.ts'
import { type RouterTest, setupRouterTest, closeRouterTest } from '../../utils/testing/setup-router-test.ts'
import getRoot from '../../utils/get-root.ts'

describe('/auth', () => {
  let test: RouterTest

  beforeAll(async () => {
    test = await setupRouterTest()
  })

  afterEach(async () => {
    await DB.clear()
  })

  afterAll(async () => {
    closeRouterTest(test)
    await DB.close()
  })

  describe('Collection [/auth]', () => {
    describe('GET', () => {
      it('returns a directory of available endpoints', async () => {
        const res = await supertest(getRoot())
          .get('/auth')

        expect(res.status).toBe(200)
        expect(res.body.links.self).toBe(getRoot() + '/auth')
        expect(res.body.links.describedBy).toBe(getRoot() + '/docs')
        expect(res.body.links.tokens).toBe(getRoot() + '/auth/tokens')
      })
    })
  })
})
