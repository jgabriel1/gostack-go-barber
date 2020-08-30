/* eslint-disable import/prefer-default-export */
import dotenv from 'dotenv'

dotenv.config()

const POSTGRES_URL = process.env.POSTGRES_URL || ''

export { POSTGRES_URL }
