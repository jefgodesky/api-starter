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
    const raw = url.searchParams.get(key) ?? ''
    fields[t] = raw.split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  }

  return fields
}

export default parseFields
