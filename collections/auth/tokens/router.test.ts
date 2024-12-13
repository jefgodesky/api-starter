import { describe, beforeAll, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import DB from '../../../DB.ts'
import { type RouterTest, setupRouterTest, closeRouterTest } from '../../../utils/setup-router-test.ts'
import getRoot from '../../../utils/get-root.ts'

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
    it('returns a directory of available endpoints', async () => {
      const res = await supertest(getRoot())
        .get('/auth')

      expect(res.status).toBe(200)
      expect(res.body.links.self).toBe(getRoot() + '/auth')
      expect(res.body.links.describedBy).toBe(getRoot() + '/docs')
      expect(res.body.links.tokens).toBe(getRoot() + '/auth/tokens')
    })
  })

  describe('/auth/tokens', () => {
    describe('Collection [/auth/tokens]', () => {
      describe('POST', () => {
        it('returns 400 if given a bad token', async () => {
          const res = await supertest(getRoot())
            .post('/auth/tokens')
            .set({'Content-Type': 'application/vnd.api+json'})
            .send({
              data: {
                type: 'tokens',
                attributes: {
                  token: 'nope'
                }
              }
            })

          expect(res.status).toBe(400)
        })
      })
    })
  })
})
