import parseCommaSeparated from '../comma-sep.ts'

const parseInclude = (
  url: URL,
): string[] | undefined => {
  if (!url.searchParams.has('include')) return undefined
  return parseCommaSeparated(url.searchParams.get('include') ?? '')
}

export default parseInclude
