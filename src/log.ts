import { pino } from 'pino'
import { LogLayer } from 'loglayer'
import { PinoTransport } from '@loglayer/transport-pino'
import { redactionPlugin } from '@loglayer/plugin-redaction'
import { serializeError } from 'serialize-error'

const log = new LogLayer({
  errorSerializer: serializeError,
  transport: new PinoTransport({ logger: pino() }),
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
