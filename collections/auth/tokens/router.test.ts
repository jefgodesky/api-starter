import { describe, beforeAll, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import DB from '../../../DB.ts'
import { type RouterTest, setupRouterTest, closeRouterTest } from '../../../utils/setup-router-test.ts'
import getRoot from '../../../utils/get-root.ts'

describe('/auth/tokens', () => {
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
