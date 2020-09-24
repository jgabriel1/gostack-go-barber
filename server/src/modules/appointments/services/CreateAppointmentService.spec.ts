import 'reflect-metadata'

import AppError from '@shared/errors/AppError'
import CreateAppointmentService from './CreateAppointmentService'
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let createAppointment: CreateAppointmentService

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository)
  })

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      user_id: '123456',
      provider_id: '123456',
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('123456')
  })

  it('should not be able to create two appointments at the same time', async () => {
    const appointmentDate = new Date(2020, 8, 18, 11)

    await createAppointment.execute({
      date: appointmentDate,
      user_id: '123456',
      provider_id: '123456',
    })

    const secondAppointmentCreation = createAppointment.execute({
      date: appointmentDate,
      user_id: '123456',
      provider_id: '123456',
    })

    expect(secondAppointmentCreation).rejects.toBeInstanceOf(AppError)
  })
})
