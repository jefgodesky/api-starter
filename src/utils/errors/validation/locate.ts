import { type ValidationTargets } from 'hono'
import { IssueTargetSchema, type IssueLocation, type IssueTarget } from './schemas.ts'
import zodPathToPointer from '../../strings/zod-path-to-pointer.ts'

const { enum: targetOptions } = IssueTargetSchema
const targets: Record<keyof ValidationTargets, IssueTarget> = {
  json: targetOptions.body,
  form: targetOptions.body,
  query: targetOptions.query,
  param: targetOptions.path,
  header: targetOptions.header,
  cookie: targetOptions.cookie
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
