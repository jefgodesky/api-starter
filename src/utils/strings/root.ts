import getVersion from './v.js'
import env from '../../env.js'

const getRoot = (): string => {
  const v = getVersion()
  return env.PORT === 80
    ? `${env.API_PROTOCOL}://${env.API_DOMAIN}/${v}`
    : `${env.API_PROTOCOL}://${env.API_DOMAIN}:${env.PORT}/${v}`
}

export default getRoot
