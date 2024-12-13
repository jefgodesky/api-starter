import Links from './links.ts'

export default interface PaginatedLinks extends Links {
  first: string
  prev: string
  next: string
  last: string
}
