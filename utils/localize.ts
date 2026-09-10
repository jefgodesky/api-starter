import { parse } from 'yaml'
import { getObjectRecord, isString } from '@revolutionarygamesco/common'

const localize = (key: string): string => {
  const path = '/api/messages.yaml'
  const yaml = Deno.readTextFileSync(path)
  const dict = parse(yaml) as Record<string, Record<string, unknown>>
  const lang = Deno.env.get('LANG') ?? 'en-us'
  const value = key.split('.')
    .reduce<unknown>((node, segment) => {
      const obj = getObjectRecord(node)
      if (!obj) return null
      return obj[segment]
    }, dict[lang])
  return isString(value) ? value : key
}

export default localize
