import { readFileSync } from 'node:fs'
import { parse } from 'yaml'
import {
  getNestedValue,
  interpolate,
  isString
} from '@revolutionarygamesco/common'
import env from '../env.ts'

const NOT_FOUND_KEY = 'not-found'
const BASE_ERROR = '{key} does not exist.'

export const loadDict = (): Record<string, unknown> => {
  const dirname = import.meta.dirname
  const filename = `${dirname}/../../intl/${env.LANG}.yaml`
  const yaml = readFileSync(filename, { encoding: 'utf8' })
  return parse(yaml) as Record<string, unknown>
}

const t = (
  key: string,
  data: Record<string, unknown> = {}
): string => {
  const dict = loadDict()
  const template = getNestedValue(dict, key)
  if (key === NOT_FOUND_KEY && !isString(template)) return BASE_ERROR
  return isString(template)
    ? interpolate(template, data)
    : t('not-found', { key })
}

export default t
