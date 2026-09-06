import type { Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface UsersData {
  id: Generated<string>
  name: string
  username: string | null
}

export type User = Selectable<UsersData>
export type NewUser = Insertable<UsersData>
export type UserUpdate = Updateable<UsersData>
