import { describe, beforeEach, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import supertest from 'supertest'
import DB from '../../DB.ts'
import setupUser from '../../utils/testing/setup-user.ts'
import getSupertestRoot from '../../utils/testing/get-supertest-root.ts'
import authTokenToJWT from '../../utils/transformers/auth-token-to-jwt.ts'

describe('/accounts', () => {
  let jwt: string

  beforeEach(async () => {
    const data = await setupUser({ createAccount: false, createToken: true })
    jwt = await authTokenToJWT(data.token!)
  })

  afterEach(async () => {
    await DB.clear()
  })

  afterAll(async () => {
    await DB.close()
  })

  describe('Collection [/accounts]', () => {
    describe('POST', () => {
      it('returns 401 if not authenticated', async () => {
        const res = await supertest(getSupertestRoot())
          .post('/accounts')
          .set({'Content-Type': 'application/vnd.api+json'})
          .send({
            data: {
              type: 'tokens',
              attributes: {
                token: 'nope'
              }
            }
          })

        expect(res.status).toBe(401)
      })

      it('returns 400 if given a bad token', async () => {
        const res = await supertest(getSupertestRoot())
          .post('/accounts')
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })
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

    describe('GET', () => {
      it('returns 401 if not authenticated', async () => {
        const res = await supertest(getSupertestRoot())
          .get('/accounts')
          .set({'Content-Type': 'application/vnd.api+json'})

        expect(res.status).toBe(401)
      })

      it('returns a list of providers', async () => {
        const { account, token } = await setupUser()
        const jwt = await authTokenToJWT(token!)
        const res = await supertest(getSupertestRoot())
          .get('/accounts')
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })

        expect(res.status).toBe(200)
        expect(res.body.data).toHaveLength(1)
        expect(res.body.data[0].type).toBe('provider')
        expect(res.body.data[0].id).toBe(account!.provider)
      })
    })
  })

  describe('Resource [/accounts/:provider]', () => {
    describe('GET', () => {
      it('returns 401 if not authenticated', async () => {
        const { account } = await setupUser()
        const res = await supertest(getSupertestRoot())
          .get(`/accounts/${account!.provider}`)
          .set({'Content-Type': 'application/vnd.api+json'})

        expect(res.status).toBe(401)
      })

      it('returns the provider', async () => {
        const { account, token } = await setupUser()
        const jwt = await authTokenToJWT(token!)
        const res = await supertest(getSupertestRoot())
          .get(`/accounts/${account!.provider}`)
          .set({
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/vnd.api+json'
          })

        expect(res.status).toBe(200)
        expect(res.body.data.type).toBe('provider')
        expect(res.body.data.id).toBe(account!.provider)
      })
    })
  })
})
