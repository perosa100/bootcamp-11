import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'
import AppError from '@shared/errors/AppError'
import { format, getHours, isBefore, startOfHour } from 'date-fns'
import { inject, injectable } from 'tsyringe'
import Appointment from '../infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

interface IRequest {
  provider_id: string
  user_id: string
  date: Date
}

@injectable()
export default class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    provider_id,
    user_id,
    date
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date)

    if (user_id === provider_id) {
      throw new AppError('Cannot create an appointment with yourself')
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('Cannot create an appointment on a past date')
    }

    const appointmentHour = getHours(appointmentDate)
    if (appointmentHour < 8 || appointmentHour > 17) {
      throw new AppError('Cannot create appointments before 8am or after 5pm')
    }

    const bookedAppointmentInSameDateExists = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id
    )

    if (bookedAppointmentInSameDateExists) {
      throw new AppError("There's another appointment booked at that time")
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate
    })

    const formattedDate = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'")

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${formattedDate}`
    })

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d'
      )}`
    )

    return appointment
  }
}
