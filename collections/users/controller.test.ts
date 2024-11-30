import { describe, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import { Response } from '../../jsonapi.d.ts'
import DB from '../../DB.ts'
import UserController from './controller.ts'

describe('UserController', () => {
  afterEach(async () => {
    await DB.clear()
  })

  afterAll(async () => {
    await DB.close()
  })

  const expectUser = (res: Response, name: string): void => {
    expect(res.data).toBeDefined()
    expect(res.data[0].type).toBe('users')
    expect(res.data[0].attributes).toHaveProperty('name', name)
  }

  describe('create', () => {
    it('creates a new user', async () => {
      const name = 'John Doe'
      const res = await UserController.create({
        data: {
          type: 'users',
          attributes: { name }
        }
      })
      expectUser(res, name)
    })
  })
})
