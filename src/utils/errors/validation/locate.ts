import { type ValidationTargets } from 'hono'
import zodPathToPointer from '../../strings/zod-path-to-pointer.ts'

export type IssueLocationTarget = 'body' | 'query' | 'path' | 'header' | 'cookie'

export interface IssueLocation {
  target: IssueLocationTarget
  pointer: string
}

const targets: Record<keyof ValidationTargets, IssueLocationTarget> = {
  json: 'body',
  form: 'body',
  query: 'query',
  param: 'path',
  header: 'header',
  cookie: 'cookie'
}

const locateIssue = (
  validationTarget: keyof ValidationTargets,
  path: PropertyKey[]
): IssueLocation => {
  const target = targets[validationTarget]
  const pointer = target === 'body'
    ? zodPathToPointer(path)
    : path[0] ? path[0].toString() : ''
  return { target, pointer }
}

export default locateIssue
