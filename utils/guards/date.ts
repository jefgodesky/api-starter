const isDateOrUndefined = (value: unknown): value is Date | undefined => {
  if (value === undefined) return true
  return value instanceof Date

}

export default isDateOrUndefined
