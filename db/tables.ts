import type { AccountsData } from '../resources/accounts/db/types.ts'
import type { TokensData } from '../resources/auth/tokens/db/types.ts'
import type { UsersData } from '../resources/users/db/types.ts'

export interface Database {
  accounts: AccountsData
  tokens: TokensData
  users: UsersData
}
