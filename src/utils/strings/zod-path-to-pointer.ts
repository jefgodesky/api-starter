import { escapeJSONPointer } from '@revolutionarygamesco/common'

const zodPathToPointer = (
  path: PropertyKey[]
): string => {
  if (path.length === 0) return ''
  const pointers = path.map(el => escapeJSONPointer(el))
  return '/' + pointers.join('/')
}

export default zodPathToPointer
