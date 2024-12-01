import { describe, it } from 'jsr:@std/testing/bdd'
import { expect } from 'jsr:@std/expect'
import stringToReadableStream from './string-to-readable-stream.ts'

describe('stringToReadableStream', () => {
  const greeting = 'Hello, world!'
  const readableStreamToString = async (stream: ReadableStream<any>): Promise<string> => {
    const reader = stream.getReader()
    const decoder = new TextDecoder()
    let result = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      result += decoder.decode(value, { stream: true })
    }

    result += decoder.decode()
    return result
  }

  it('returns a readable stream', async () => {
    const stream = stringToReadableStream(greeting)
    const back = await readableStreamToString(stream)
    expect(typeof stream).not.toBe('string')
    expect(back).toEqual(greeting)
  })
})
