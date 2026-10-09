import jsonapi from 'ts-japi'
const version = '1.1'

export const errorSerializer = new jsonapi.ErrorSerializer({ version })
