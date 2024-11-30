import { Context } from '@oak/oak'
import User from './model.ts'
import UserRepository from './repository.ts'
import { Response } from '../../jsonapi.d.ts'
import {
  makeUserResponse,
  getUserFields,
  allUserAttributes,
  type UserCreation
} from './resource.ts'

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
    return makeUserResponse(saved, allUserAttributes)
  }

  static async getById (id: string, url?: Context | URL): Promise<Response | undefined> {
    const repository = UserController.getRepository()
    const user = await repository.get(id)
    const fields = url ? getUserFields(url) : undefined
    return user
      ? makeUserResponse(user, fields)
      : undefined
  }
}

export default UserController
