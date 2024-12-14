import * as uuid from '@std/uuid'
import type Provider from '../../types/provider.ts'
import type Response from '../../types/response.ts'
import UserRepository from '../users/repository.ts'
import AccountRepository from './repository.ts'
import getJSONAPI from '../../utils/get-jsonapi.ts'
import getRoot from '../../utils/get-root.ts'
import ProviderResource from '../../types/provider-resource.ts'

class AccountController {
  private static users: UserRepository
  private static accounts: AccountRepository

  constructor () {
    AccountController.getRepositories()
  }

  static getRepositories (): {
    users: UserRepository,
    accounts: AccountRepository
  } {
    if (!AccountController.users) AccountController.users = new UserRepository()
    if (!AccountController.accounts) AccountController.accounts = new AccountRepository()

    return {
      users: AccountController.users,
      accounts: AccountController.accounts
    }
  }

  static async list (id: string): Promise<Response | undefined> {
    if (!uuid.v4.validate(id)) return undefined
    const { accounts } = AccountController.getRepositories()
    const accts = await accounts.listProviders(id)
    const data: ProviderResource[] = accts.map(id => ({ type: 'provider', id }))
    return data.length === 0
      ? undefined
      : {
          jsonapi: getJSONAPI(),
          links: {
            self: getRoot() + '/providers',
            describedBy: getRoot() + '/docs'
          },
          data
        }
  }

  static async get (id: string, provider: Provider): Promise<Response | undefined> {
    if (!uuid.v4.validate(id)) return undefined
    const { accounts } = AccountController.getRepositories()
    const acct = await accounts.getByUIDAndProvider(id, provider)
    return acct === null
      ? undefined
      : {
        jsonapi: getJSONAPI(),
        links: {
          self: getRoot() + '/providers/' + acct.provider,
          describedBy: getRoot() + '/docs'
        },
        data: {
          type: 'provider',
          id: acct.provider
        }
      }
  }
}

export default AccountController
