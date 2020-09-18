import { Between, getRepository, Repository } from 'typeorm'

import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns'

import ICreateAppointmentsDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO'
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'

import Appointment from '../entities/Appointment'

export default class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>

  constructor() {
    this.ormRepository = getRepository(Appointment)
  }

  public async create({
    provider_id,
    user_id,
    date
  }: ICreateAppointmentsDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date
    })
    await this.ormRepository.save(appointment)
    return appointment
  }

  public async list(): Promise<Appointment[]> {
    return this.ormRepository.find()
  }

  public async findByDate(
    date: Date,
    provider_id: string
  ): Promise<Appointment | undefined> {
    return this.ormRepository.findOne({
      where: { date, provider_id },
      order: { date: 'ASC' }
    })
  }

  public async findAllinDayFromProvider({
    provider_id,
    day,
    month,
    year
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const date = new Date(year, month - 1, day)

    return this.ormRepository.find({
      where: {
        provider_id,
        date: Between(startOfDay(date), endOfDay(date))
      },
      relations: ['user']
    })
  }

  public async findAllinMonthFromProvider({
    provider_id,
    month,
    year
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const date = new Date(year, month - 1, 1)

    return this.ormRepository.find({
      where: {
        provider_id,
        date: Between(startOfMonth(date), endOfMonth(date))
      }
    })
  }
}
