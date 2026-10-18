import { pino } from 'pino'
import pretty from 'pino-pretty'
import { LogLayer } from 'loglayer'
import { PinoTransport } from '@loglayer/transport-pino'
import { redactionPlugin } from '@loglayer/plugin-redaction'
import { serializeError } from 'serialize-error'
import env from './env.ts'

const logger = pino(env.PRETTY_LOGS ? pretty() : undefined)
const log = new LogLayer({
  errorSerializer: serializeError,
  transport: new PinoTransport({ logger }),
  plugins: [
    redactionPlugin({
      paths: ['password'],
      censor: '***'
    })
  ],
  contextFieldName: 'context',
  metadataFieldName: 'metadata'
})

export default log
