import { describe, beforeAll, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import DB from '../../../DB.ts'
import { type RouterTest, setupRouterTest, closeRouterTest } from '../../../utils/setup-router-test.ts'
import getRoot from '../../../utils/get-root.ts'
import ProviderResource from '../../../types/provider-resource.ts'

describe('/auth/providers', () => {
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

  describe('Collection [/auth/providers]', () => {
    describe('GET', () => {
      it('returns a list of supported OAuth 2.0 providers', async () => {
        const res = await supertest(getRoot())
          .get('/auth/providers')

        const { links, data } = res.body
        const providers = data.map((provider: ProviderResource) => provider.id)
        expect(res.status).toBe(200)
        expect(links.self).toBe('http://localhost:8001/v1/auth/providers')
        expect(links.describedBy).toBe('http://localhost:8001/v1/docs')
        expect(data).toHaveLength(3)
        expect(providers).toContain('google')
        expect(providers).toContain('github')
        expect(providers).toContain('discord')
      })
    })
  })
})