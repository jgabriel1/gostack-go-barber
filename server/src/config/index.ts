/* eslint-disable import/prefer-default-export */
import dotenv from 'dotenv'

dotenv.config()

const POSTGRES_URL =
  process.env.POSTGRES_URL ||
  'postgres://username:password@localhost:5432/default'

export { POSTGRES_URL }
