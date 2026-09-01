import { parseIntOr } from '@revolutionarygamesco/common'

const getEnvNumber = (
  name: string,
  fallback: number = 0
): number => {
  const str = Deno.env.get(name)
  if (str === undefined) return fallback
  return parseIntOr(str, fallback)
}

export default getEnvNumber
