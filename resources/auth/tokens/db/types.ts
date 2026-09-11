import type { ColumnType, Generated, Insertable, Selectable } from 'kysely'

export interface TokensData {
  id: Generated<string>
  uid: string
  refresh: string
  xtkn: ColumnType<Date, Date | string, Date | string>
  cref: ColumnType<Date, Date | string, Date | string>
}

export type TokenRecord = Selectable<TokensData>
export type NewTokenRecord = Insertable<TokensData>
