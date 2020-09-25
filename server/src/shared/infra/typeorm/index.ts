import { createConnection } from 'typeorm'

Promise.all([
  createConnection('default').then(() => console.log('Connected to postgres')),
  createConnection('mongo').then(() => console.log('Connected to mongo')),
]).catch(console.error)
