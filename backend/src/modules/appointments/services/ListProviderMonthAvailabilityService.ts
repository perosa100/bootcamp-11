import { inject, injectable } from 'tsyringe'

import { getDate, getHours, getDaysInMonth, isAfter } from 'date-fns'

import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

interface IRequest {
  provider_id: string
  month: number
  year: number
}

interface IDayAvailability {
  day: number
  available: boolean
}

type IResponse = IDayAvailability[]

@injectable()
export default class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    month,
    year
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllinMonthFromProvider(
      {
        provider_id,
        month,
        year
      }
    )

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1))

    const daysInMonth = Array.from(
      { length: numberOfDaysInMonth },
      (value, index) => index + 1
    )

    const hoursInDay = Array.from(
      { length: 18 - 8 },
      (value, index) => index + 8
    )

    const currentTime = Date.now()

    const availability = daysInMonth.map((day) => {
      const appointmentsInDay = appointments.filter(
        (appointment: { date: number | Date }) =>
          getDate(appointment.date) === day
      )

      const availableHours = hoursInDay.filter((hour) => {
        const appointmentInHour = appointmentsInDay.find(
          (appointment: { date: number | Date }) =>
            getHours(appointment.date) === hour
        )

        const appointmentTime = new Date(year, month - 1, day, hour)

        return !appointmentInHour && isAfter(appointmentTime, currentTime)
      })

      return {
        day,
        available: availableHours.length > 0
      }
    })

    return availability
  }
}
