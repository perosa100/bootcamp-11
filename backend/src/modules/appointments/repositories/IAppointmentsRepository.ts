import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import IFindAllInDayFromProviderDTO from '../dtos/IFindAllInDayFromProviderDTO'
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllInMonthFromProviderDTO'

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>
  findAllinMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO
  ): Promise<Appointment[]>
  findAllinDayFromProvider(
    data: IFindAllInDayFromProviderDTO
  ): Promise<Appointment[]>
}
