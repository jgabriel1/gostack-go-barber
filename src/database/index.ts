import { createConnection, getConnectionOptions } from 'typeorm'
import { POSTGRES_URL } from '../config'

async function main() {
  const connectionOptions = await getConnectionOptions()

  Object.assign(connectionOptions, { url: POSTGRES_URL })

  await createConnection(connectionOptions)
}

main().catch(console.error)
