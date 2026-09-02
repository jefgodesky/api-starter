import { parse } from '@std/yaml'

const localize = (key: string): string => {
  const path = '/app/messages.yaml'
  const yaml = Deno.readTextFileSync(path)
  const dict = parse(yaml) as Record<string, Record<string, string>>
  const lang = Deno.env.get('LANG') ?? 'en-us'
  return dict[lang][key] ?? key
}

export default localize
