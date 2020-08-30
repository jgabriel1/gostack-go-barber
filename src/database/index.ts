import { createConnection, getConnectionOptions } from 'typeorm'

async function main() {
  const connectionOptions = await getConnectionOptions()
  await createConnection(connectionOptions)
}

main().catch(console.error)
