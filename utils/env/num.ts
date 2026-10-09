import { parseFloatOr, parseIntOr } from '@revolutionarygamesco/common'

const getEnvNum = (
  key: string,
  fallback: number
): number => {
  const str = Deno.env.get(key)
  if (!str) return fallback

  const parser = str.includes('.') ? parseFloatOr : parseIntOr
  return str ? parser(str, fallback) : fallback
}

export default getEnvNum
