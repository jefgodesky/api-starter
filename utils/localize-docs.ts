import localize from './localize.ts'

const localizeDocs = (
  prefix: string,
) => {
  return (
    route: string,
    status: number,
  ) => localize(['docs', prefix, route, status.toString()].join('.'))
}

export default localizeDocs
