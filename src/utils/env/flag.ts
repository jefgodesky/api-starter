export const FALSY_FLAG_VALUES = ['false', '0', 'null', 'undefined', '']

const checkEnvFlag = (
  key: string
): boolean => {
  const str = Deno.env.get(key)
  if (!str) return false
  return !FALSY_FLAG_VALUES.includes(str)
}

export default checkEnvFlag
