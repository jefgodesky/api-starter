import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import { createUserAttributes, publicUserAttributes } from '../../types/user-attributes.ts'
import getAllFieldCombinations from '../testing/get-all-field-combinations.ts'
import getRoot from '../get-root.ts'
import urlToUserFields from './url-to-user-fields.ts'

describe('urlToUserFields', () => {
  it('returns public attributes if there is no fields[users] parameter', () => {
    const url = new URL(`${getRoot()}/users`)
    const actual = urlToUserFields(url)
    expect(actual).toEqual(publicUserAttributes)
  })

  it('returns the fields specified', () => {
    const attributes = createUserAttributes()
    const objects = getAllFieldCombinations(attributes)
    for (const object of objects) {
      const fields = Object.keys(object)
      const url = new URL(`${getRoot()}/users?this=1&fields[users]=${fields.join(',')}&that=2`)
      const actual = urlToUserFields(url)
      expect(actual).toEqual(fields)
    }
  })
})
