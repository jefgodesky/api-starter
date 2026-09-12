import hashRefreshToken from './hash.ts'

const verifyRefreshToken = async (
  secret: string,
  expected: string,
): Promise<boolean> => {
  return await hashRefreshToken(secret) === expected
}

export default verifyRefreshToken
