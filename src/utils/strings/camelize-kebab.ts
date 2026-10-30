import { capitalize } from '@revolutionarygamesco/common'

const camelizeKebab = (kebab: string): string => {
  const [first, ...rest] = kebab.split('-')
  return first + rest.map(w => capitalize(w)).join('')
}

export default camelizeKebab
