import bytesToHex from '../hex.ts'

const createRefreshToken = (bytes: number = 32): string => {
  const buffer = new Uint8Array(bytes)
  crypto.getRandomValues(buffer)
  return bytesToHex(buffer)
}

export default createRefreshToken
