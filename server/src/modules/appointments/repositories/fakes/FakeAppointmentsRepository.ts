import { uuid } from 'uuidv4'
import { isEqual, getMonth, getYear, getDate } from 'date-fns'

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO'
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO'
import Appointment from '../../infra/typeorm/entities/Appointment'

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[]

  constructor() {
    this.appointments = []
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    return this.appointments.filter(
      appointment =>
        provider_id === appointment.provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    )
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    return this.appointments.filter(
      appointment =>
        provider_id === appointment.provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    )
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    return this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    )
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment()

    Object.assign(appointment, { id: uuid(), date, provider_id, user_id })

    this.appointments.push(appointment)

    return appointment
  }
}

export default FakeAppointmentsRepository