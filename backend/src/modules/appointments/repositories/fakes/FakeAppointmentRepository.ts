import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllinDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO'
import IFindAllinMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import { getDate, getMonth, getYear, isEqual } from 'date-fns'
import { v4 } from 'uuid'

class AppointmentsRepository implements IAppointmentsRepository {
  public async findAllinDayFromProvider({
    provider_id,
    month,
    year,
    day
  }: IFindAllinDayFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      (appointment) =>
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
    )

    return appointments
  }

  private appointments: Appointment[] = []

  public async findByDate(
    date: Date,
    provider_id: string
  ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      (appointment) =>
        isEqual(appointment.date, date) &&
        appointment.provider_id === provider_id
    )

    return findAppointment
  }

  public async findAllinMonthFromProvider({
    provider_id,
    month,
    year
  }: IFindAllinMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      (appointment) =>
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
    )

    return appointments
  }

  public async create({
    provider_id,
    date,
    user_id
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment()

    Object.assign(appointment, { id: v4(), date, provider_id, user_id })

    this.appointments.push(appointment)

    return appointment
  }
}
export default AppointmentsRepository
