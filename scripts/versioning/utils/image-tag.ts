const getImageTag = (name: string): string | undefined => {
  const matches = name.match(/^.*?\/.*?:(.*?)$/)
  return matches ? matches[1] : undefined
}

export default getImageTag
