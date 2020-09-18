import { classToClass } from 'class-transformer'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import { inject, injectable } from 'tsyringe'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

interface IRequest {
  provider_id: string
  day: number
  month: number
  year: number
}

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    provider_id,
    month,
    year,
    day
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${provider_id}${year}-${month}-${day}`

    let appointments = await this.cacheProvider.recover<Appointment[]>(cacheKey)

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllinDayFromProvider(
        {
          provider_id,
          month,
          year,
          day
        }
      )

      await this.cacheProvider.save(cacheKey, classToClass(appointments))
    }

    return appointments
  }
}

export default ListProviderMonthAvailabilityService
