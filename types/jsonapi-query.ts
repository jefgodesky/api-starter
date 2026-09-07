export interface JSONAPISort {
  column: string
  order: 'asc' | 'desc'
}

export interface JSONAPIQuery {
  include?: string[]
  fields: Record<string, string[]>
  sort: JSONAPISort[]
  page: {
    offset: number
    limit: number
  }
}

export interface Env {
  Variables: {
    query: JSONAPIQuery
  }
}
