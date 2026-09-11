import type { Generated, Insertable, Selectable } from 'kysely'
import { type Provider } from '../../auth/schema.ts'

export interface AccountsData {
  id: Generated<string>
  uid: string
  provider: Provider
  pid: string
}

export type Account = Selectable<AccountsData>
export type NewAccount = Insertable<AccountsData>
