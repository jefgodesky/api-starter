import {
  BlankTransport,
  type LogLayer,
  type LogLayerTransportParams,
  type LogLevelType
} from 'loglayer'
import createLogger from '../logger/create.js'

export interface LogCapture {
  readonly logger: LogLayer
  readonly records: LogLayerTransportParams[]
  at: (level: LogLevelType) => LogLayerTransportParams[]
}

const captureLogs = (): LogCapture => {
  const records: LogLayerTransportParams[] = []
  const logger = createLogger(new BlankTransport({
    shipToLogger: (params) => {
      records.push(params)
      return params.messages
    }
  }))

  return {
    logger,
    records,
    at: (level) => records.filter((r) => r.logLevel === level)
  }
}

export default captureLogs
