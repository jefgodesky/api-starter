import { readFileSync } from 'fs'
import { parse } from 'yaml'

const readYAML = <T extends Record<string, unknown>>(filename: string): T => {
  try {
    const text = readFileSync(filename, 'utf8')
    return parse(text)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

export default readYAML
