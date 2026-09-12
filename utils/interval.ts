export const MS_PER_S = 1000
export const MS_PER_M = 60 * MS_PER_S
export const MS_PER_H = 60 * MS_PER_M
export const MS_PER_D = 24 * MS_PER_H
export const MS_PER_W = 7 * MS_PER_D

const parseInterval = (s: string): number => {
  const seconds = s.match(/^(\d+(\.\d+)?) seconds?$/)
  const minutes = s.match(/^(\d+(\.\d+)?) minutes?$/)
  const hours = s.match(/^(\d+(\.\d+)?) hours?$/)
  const days = s.match(/^(\d+(\.\d+)?) days?$/)
  const weeks = s.match(/^(\d+(\.\d+)?) weeks?$/)

  if (seconds) {
    const n = parseFloat(seconds[1])
    return n * MS_PER_S
  } else if (minutes) {
    const n = parseFloat(minutes[1])
    return n * MS_PER_M
  } else if (hours) {
    const n = parseFloat(hours[1])
    return n * MS_PER_H
  } else if (days) {
    const n = parseFloat(days[1])
    return n * MS_PER_D
  } else if (weeks) {
    const n = parseFloat(weeks[1])
    return n * MS_PER_W
  } else {
    return 0
  }
}

export default parseInterval
