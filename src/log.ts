import { pino } from 'pino'
import { LogLayer } from 'loglayer'
import { PinoTransport } from '@loglayer/transport-pino'
import { redactionPlugin } from '@loglayer/plugin-redaction'
import { serializeError } from 'serialize-error'
import env from './env.ts'

const log = new LogLayer({
  errorSerializer: serializeError,
  transport: new PinoTransport({
    logger: pino(env.PRETTY_LOGS
      ? { transport: { target: 'pino-pretty' } }
      : {}
    )
  }),
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
