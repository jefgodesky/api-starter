const parseCommaSeparated = (
  str: string,
): string[] => {
  return str.split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

export default parseCommaSeparated
