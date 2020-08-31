const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  name: "default",
  type: "postgres",
  url: process.env.POSTGRES_URL,
  entities: ["./src/models/*.ts"],
  migrations: ["./src/database/migrations/*.ts"],
  cli: {
    migrationsDir: "./src/database/migrations"
  }
}
