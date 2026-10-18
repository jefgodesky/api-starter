import { pino } from 'pino'
import { LogLayer } from 'loglayer'
import { PinoTransport } from '@loglayer/transport-pino'
import { redactionPlugin } from '@loglayer/plugin-redaction'
import { serializeError } from 'serialize-error'
import env from './env.ts'

export const transport = new PinoTransport({
  logger: pino(env.PRETTY_LOGS
    ? { transport: { target: 'pino-pretty' } }
    : {}
  )
})

const log = new LogLayer({
  errorSerializer: serializeError,
  transport,
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
