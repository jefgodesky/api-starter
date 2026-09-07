import parseCommaSeparated from '../comma-sep.ts'

const parseFields = (
  url: URL,
): Record<string, string[]> => {
  const fields: Record<string, string[]> = {}
  const regex = /^fields\[(.*?)]$/
  const keys = url.searchParams.keys()
    .filter((key) => key.match(regex))

  for (const key of keys) {
    const match = key.match(regex)
    if (!match) continue
    const t = match[1]
    fields[t] = parseCommaSeparated(url.searchParams.get(key) ?? '')
  }

  return fields
}

export default parseFields
