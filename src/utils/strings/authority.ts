import env from '../../env.js'

const getAuthority = (): string => {
  return env.PORT === 80
    ? `${env.API_PROTOCOL}://${env.API_DOMAIN}`
    : `${env.API_PROTOCOL}://${env.API_DOMAIN}:${env.PORT}`
}

export default getAuthority
