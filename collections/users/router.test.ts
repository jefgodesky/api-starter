import { describe, beforeAll, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import { type RouterTest, setupRouterTest, closeRouterTest } from '../../utils/setup-router-test.ts'
import getRoot from '../../utils/get-root.ts'

describe('/users', () => {
  let test: RouterTest

  beforeAll(async () => {
    test = await setupRouterTest()
  })

  afterAll(() => {
    closeRouterTest(test)
  })

  describe('POST', () => {
    it('returns 400 if given bad data', async () => {
      const res = await supertest(getRoot())
        .post('/users')
        .send({ invalid: 'data' })

      expect(res.status).toBe(400)
    })

    it('creates a new user', async () => {
      const payload = {
        data: {
          type: 'users',
          attributes: {
            name: 'John Doe'
          }
        }
      }

      const res = await supertest(getRoot())
        .post('/users')
        .send(payload)

      expect(res.status).toBe(200)
      expect(res.body.data).toBeDefined()
      expect(res.body.data[0].type).toBe('users')
      expect(res.body.data[0].attributes).toHaveProperty('name', payload.data.attributes.name)
      expect(res.body.data[0].attributes.key).toBeDefined()
    })
  })
})
