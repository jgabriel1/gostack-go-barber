import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO'
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO'
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import { getRepository, Raw, Repository } from 'typeorm'
import Appointment from '../entities/Appointment'

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>

  constructor() {
    this.ormRepository = getRepository(Appointment)
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    })

    return findAppointment
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = month.toString().padStart(2, '0')

    return this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateAlias =>
            `to_char(${dateAlias}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    })
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = day.toString().padStart(2, '0')
    const parsedMonth = month.toString().padStart(2, '0')

    return this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateAlias =>
            `to_char(${dateAlias}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      relations: ['user'],
    })
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    })

    await this.ormRepository.save(appointment)

    return appointment
  }
}

export default AppointmentsRepository
