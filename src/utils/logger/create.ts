import { LogLayer, type LogLayerTransport } from 'loglayer'
import { redactionPlugin } from '@loglayer/plugin-redaction'
import { serializeError } from 'serialize-error'

const createLogger = (
  transport: LogLayerTransport
): LogLayer => {
  return new LogLayer({
    errorSerializer: serializeError,
    transport,
    contextFieldName: 'context',
    metadataFieldName: 'metadata',
    plugins: [
      redactionPlugin({
        paths: ['password'],
        censor: '***'
      })
    ]
  })
}

export default createLogger
