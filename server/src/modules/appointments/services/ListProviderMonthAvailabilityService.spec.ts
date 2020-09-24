import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let listProviderMonthAvailability: ListProviderMonthAvailabilityService

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    )
  })

  it('should be able to list all days available in a single month for a provider', async () => {
    await fakeAppointmentsRepository.create({
      user_id: 'user-id',
      provider_id: 'user-id',
      date: new Date(2020, 4, 21, 8, 0, 0),
    })

    await Promise.all(
      Array.from({ length: 10 }, (_, index) => index + 8).map(hour =>
        fakeAppointmentsRepository.create({
          user_id: 'user-id',
          provider_id: 'user-id',
          date: new Date(2020, 4, 20, hour, 0, 0),
        }),
      ),
    )

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'user-id',
      year: 2020,
      month: 5,
    })

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    )
  })
})
