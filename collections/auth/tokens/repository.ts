import Repository from '../../base/repository.ts'
import AuthToken from './model.ts'

export default class AuthTokenRepository extends Repository<AuthToken> {
  constructor () {
    super('tokens')
  }
}
