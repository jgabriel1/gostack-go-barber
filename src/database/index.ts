import { createConnection } from 'typeorm'

createConnection({
  name: 'gobarber',
  type: 'sqlite',
  database: './src/database/db.sqlite',
})
