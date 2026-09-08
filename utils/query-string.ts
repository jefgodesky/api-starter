const getQueryString = (
  params: URLSearchParams,
): string => {
  return params.entries().toArray()
    .map(([key, val]) => `${key}=${val}`)
    .join('&')
}

export default getQueryString
