const makeLink = (
  href: string,
  rel: string,
  params: Record<string, string> = {}
): string => {
  const extra = Object.entries({ rel, ...params })
    .map(([key, value]) => `; ${key}="${value}"`)
    .join('')
  return `<${href}>${extra}`
}

export default makeLink
