import bytesToHex from '../hex.ts'

const hashRefreshToken = async (orig: string): Promise<string> => {
  const encoder = new TextEncoder()
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(orig))
  return bytesToHex(new Uint8Array(digest))
}

export default hashRefreshToken
