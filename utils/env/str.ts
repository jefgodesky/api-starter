const getEnvStr = (
  key: string,
  fallback: string
): string => {
  const str = Deno.env.get(key)
  return str ?? fallback
}

export default getEnvStr
