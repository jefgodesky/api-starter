import { describe, afterEach, afterAll, it } from '@std/testing/bdd'
import { expect } from '@std/expect'
import type Response from '../../types/response.ts'
import type UserResource from '../../types/user-resource.ts'
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
    const data = res.data as UserResource
    expect(data).toBeDefined()
    expect(data.type).toBe('users')
    expect(data.attributes).toHaveProperty('name', name)
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
        const data = res?.data as UserResource
        expect(data.attributes.name).toBe(name)
        expect(data.attributes.username).toBe(username)
      }
    })
  })

  describe('getByUsername', () => {
    it('returns undefined if no user can be found', async () => {
      const res = await UserController.getByUsername(user.username)
      expect(res).toBeUndefined()
    })

    it('returns the user', async () => {
      const repository = UserController.getRepository()
      const saved = await repository.save(user)
      const res = await UserController.getByUsername(saved.username!)
      expectUser(res!, user.name)
    })

    it('returns a sparse fieldset', async () => {
      const repository = UserController.getRepository()
      const saved = await repository.save(user)
      for (const [q, name, username] of fieldsets) {
        const url = new URL(`http://localhost:8001/v1/users/${saved.id}?fields[users]=${q}`)
        const res = await UserController.getByUsername(saved.username!, url)
        const data = res?.data as UserResource
        expect(data.attributes.name).toBe(name)
        expect(data.attributes.username).toBe(username)
      }
    })
  })

  describe('get', () => {
    it('returns undefined if no user can be found by ID', async () => {
      const res = await UserController.get(crypto.randomUUID())
      expect(res).toBeUndefined()
    })

    it('returns undefined if no user can be found by username', async () => {
      const res = await UserController.get(user.username)
      expect(res).toBeUndefined()
    })

    it('returns a user found by ID', async () => {
      const repository = UserController.getRepository()
      const saved = await repository.save(user)
      const res = await UserController.get(saved.id!)
      expectUser(res!, user.name)
    })

    it('returns a user found by username', async () => {
      const repository = UserController.getRepository()
      const saved = await repository.save(user)
      const res = await UserController.get(saved.username!)
      expectUser(res!, user.name)
    })
  })
})
