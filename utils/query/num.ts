import { parseFloatOr } from '@revolutionarygamesco/common'

const parseNumber = (
  url: URL,
  param: string,
  fallback: number,
): number => {
  const val = url.searchParams.get(param)
  if (!val) return fallback
  return parseFloatOr(val, fallback)
}

export default parseNumber
