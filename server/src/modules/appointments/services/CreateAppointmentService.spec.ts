import 'reflect-metadata'

import AppError from '@shared/errors/AppError'
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'
import CreateAppointmentService from './CreateAppointmentService'
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let fakeNotificationsRepository: FakeNotificationsRepository
let fakeCacheProvider: FakeCacheProvider
let createAppointment: CreateAppointmentService

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    fakeNotificationsRepository = new FakeNotificationsRepository()
    fakeCacheProvider = new FakeCacheProvider()

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    )
  })

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: 'user-id',
      provider_id: 'provider-id',
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('provider-id')
  })

  it('should not be able to create two appointments at the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    const appointmentDate = new Date(2020, 4, 10, 13)

    await createAppointment.execute({
      date: appointmentDate,
      user_id: 'user-id',
      provider_id: 'provider-id',
    })

    const secondAppointmentCreation = createAppointment.execute({
      date: appointmentDate,
      user_id: 'user-id',
      provider_id: 'provider-id',
    })

    expect(secondAppointmentCreation).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment on a date in the past', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment for a user with themself as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        user_id: 'user-id',
        provider_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment in a time before 8:00 or after 18:00', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 7),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError)

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 18),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
