import LinkObject from './link-object.ts'
import getRoot from '../utils/get-root.ts'

export default interface Links {
  self: LinkObject | string
  related?: LinkObject | string
  describedBy?: LinkObject | string
  [key: string]: LinkObject | string | undefined
}

const createLinks = (overrides?: Partial<Links>): Links => {
  const defaultLinks: Links = {
    self: getRoot() + '/test/1',
    describedBy: getRoot() + '/docs'
  }

  return { ...defaultLinks, ...overrides }
}

export { createLinks }
