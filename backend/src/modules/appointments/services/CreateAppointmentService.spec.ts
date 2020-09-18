import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository'
import AppError from '@shared/errors/AppError'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentRepository'
import CreateAppointmentService from './CreateAppointmentService'

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
      fakeCacheProvider
    )
  })

  jest
    .spyOn(Date, 'now')
    .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime())

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: 'id',
      provider_id: '123123'
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('123123')
    expect(appointment.user_id).toBe('id')
  })

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 13)

    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime())

    await createAppointment.execute({
      date: appointmentDate,
      user_id: 'id',
      provider_id: '123123'
    })

    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime())

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: 'id',
        provider_id: '123123'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment on a past date', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime())

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: 'id',
        provider_id: '123123'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment with yourself', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime())

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        user_id: '123123',
        provider_id: '123123'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime())

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 7),
        user_id: 'id',
        provider_id: '123123'
      })
    ).rejects.toBeInstanceOf(AppError)

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 18),
        user_id: 'id',
        provider_id: '123123'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
