const dotenv = require('dotenv')

dotenv.config()

module.exports = [
  {
    name: 'default',
    type: 'postgres',
    url: process.env.POSTGRES_URL,
    entities: [
      './src/modules/**/infra/typeorm/entities/*.ts',
    ],
    migrations: ['./src/shared/infra/typeorm/migrations/*.ts'],
    cli: {
      migrationsDir: './src/shared/infra/typeorm/migrations'
    }
  },
  {
    name: 'mongo',
    type: 'mongodb',
    url: process.env.MONGO_URL,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    retryWrites: true,
    w: 'majority',
    entities: [
      './src/modules/**/infra/typeorm/schemas/*.ts',
    ],
  },
]
