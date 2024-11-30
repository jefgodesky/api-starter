import User from './model.ts'
import UserRepository from './repository.ts'
import {
  makeUserResponse,
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

  static async create (req: UserCreation) {
    const repository = UserController.getRepository()
    const user = req.data.attributes as User
    const saved = await repository.save(user)
    return makeUserResponse(saved, allUserAttributes)
  }
}

export default UserController
