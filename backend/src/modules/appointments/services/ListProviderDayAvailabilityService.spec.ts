import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentRepository'
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService'

let fakeAppointmentsRepository: FakeAppointmentsRepository

let listProviderDayAvailability: ListProviderDayAvailabilityService

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()

    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository
    )
  })

  it('should be able to list the day availability of a provider', async () => {
    const hours = Array.from({ length: 18 - 8 }, (value, index) => index + 8)

    const appointmentCreationPromises = hours
      .filter((hour) => hour >= 10 && hour <= 14)
      .map((hour) =>
        fakeAppointmentsRepository.create({
          provider_id: 'provider-id',
          user_id: '123123',
          date: new Date(2020, 4, 20, hour, 0, 0)
        })
      )

    await Promise.all(appointmentCreationPromises)

    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 3, 20).getTime())

    const availability = await listProviderDayAvailability.execute({
      provider_id: 'provider-id',
      day: 20,
      month: 5,
      year: 2020
    })

    expect(availability).toEqual(
      hours.map((hour) => ({ hour, available: hour < 10 || hour > 14 }))
    )
  })
})
