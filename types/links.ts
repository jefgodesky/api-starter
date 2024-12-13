import LinkObject from './link-object.ts'

export default interface Links {
  self: LinkObject | string
  related?: LinkObject | string
  describedBy?: LinkObject | string
  [key: string]: LinkObject | string | undefined
}
