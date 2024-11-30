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

  const user = {
    name: 'John Doe',
    username: 'john',
  }

  const fieldsets = [
    ['name', user.name, undefined],
    ['username', undefined, user.username],
    ['name,username', user.name, user.username]
  ]

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

  describe('getById', () => {
    it('returns undefined if no user can be found', async () => {
      const res = await UserController.getById(crypto.randomUUID())
      expect(res).toBeUndefined()
    })

    it('returns the user', async () => {
      const repository = UserController.getRepository()
      const saved = await repository.save(user)
      const res = await UserController.getById(saved.id!)
      expectUser(res!, user.name)
    })

    it('returns a sparse fieldset', async () => {
      const repository = UserController.getRepository()
      const saved = await repository.save(user)
      for (const [q, name, username] of fieldsets) {
        const url = new URL(`http://localhost:8001/v1/users/${saved.id}?fields[users]=${q}`)
        const res = await UserController.getById(saved.id!, url)
        expect(res!.data[0].attributes.name).toBe(name)
        expect(res!.data[0].attributes.username).toBe(username)
      }
    })
  })
})