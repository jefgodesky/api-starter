import { type ValidationTargets } from 'hono'
import zodPathToPointer from '../strings/zod-path-to-pointer.ts'

export type ZodIssueLocationTarget = 'body' | 'query' | 'path' | 'header' | 'cookie'

export interface ZodIssueLocation {
  target: ZodIssueLocationTarget
  pointer: string
}

const targets: Record<keyof ValidationTargets, ZodIssueLocationTarget> = {
  json: 'body',
  form: 'body',
  query: 'query',
  param: 'path',
  header: 'header',
  cookie: 'cookie'
}

const locateZodIssue = (
  validationTarget: keyof ValidationTargets,
  path: PropertyKey[]
): ZodIssueLocation => {
  const target = targets[validationTarget]
  const pointer = target === 'body'
    ? zodPathToPointer(path)
    : path[0] ? path[0].toString() : ''
  return { target, pointer }
}

export default locateZodIssue
