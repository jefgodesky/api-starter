import { pino } from 'pino'
import { PinoTransport } from '@loglayer/transport-pino'
import { LogLayer, LogLevel, type LogLayerTransport } from 'loglayer'
import { redactionPlugin } from '@loglayer/plugin-redaction'
import { serializeError } from 'serialize-error'
import env from './env.ts'

export const createLogger = (transport: LogLayerTransport): LogLayer =>
  new LogLayer({
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

const log = createLogger(new PinoTransport({
  logger: pino(env.PRETTY_LOGS
    ? { transport: { target: 'pino-pretty' } }
    : {}
  )
}))

log.setLevel(LogLevel[env.MIN_LOG_LEVEL])

export default log
