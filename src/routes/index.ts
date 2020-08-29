import { Router } from 'express'
import appointentsRouter from './appointments.routes'

const routes = Router()

routes.use('/appointments', appointentsRouter)

export default routes
