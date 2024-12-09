import * as uuid from '@std/uuid'
import { Context } from '@oak/oak'
import User from './model.ts'
import UserRepository from './repository.ts'
import { Response } from '../../jsonapi.d.ts'
import type UserCreation from '../../types/user-creation.ts'
import { allUserAttributes } from '../../types/user-attributes.ts'
import userToUserResponse from '../../utils/transformers/user-to-user-response.ts'
import urlToUserFields from '../../utils/transformers/url-to-user-fields.ts'

class UserController {
  private static repository: UserRepository

  constructor () {
    UserController.repository = UserController.getRepository()
  }

  static getRepository (): UserRepository {
    if (!UserController.repository) UserController.repository = new UserRepository()
    return UserController.repository
  }

  static async create (req: UserCreation): Promise<Response> {
    const repository = UserController.getRepository()
    const user = req.data.attributes as User
    const saved = await repository.save(user)
    return userToUserResponse(saved, allUserAttributes)
  }

  static async get (id: string, url?: Context | URL): Promise<Response | undefined> {
    return uuid.v4.validate(id)
      ? await UserController.getById(id, url)
      : await UserController.getByUsername(id, url)
  }

  static async getById (id: string, url?: Context | URL): Promise<Response | undefined> {
    const repository = UserController.getRepository()
    const user = await repository.get(id)
    return UserController.getUser(user, url)
  }

  static async getByUsername (username: string, url?: Context | URL): Promise<Response | undefined> {
    const repository = UserController.getRepository()
    const user = await repository.getByUsername(username)
    return UserController.getUser(user, url)
  }

  private static getUser (user: User | null, url?: Context | URL): Response | undefined {
    const fields = url ? urlToUserFields(url) : undefined
    return user
      ? userToUserResponse(user, fields)
      : undefined
  }
}

export default UserController
