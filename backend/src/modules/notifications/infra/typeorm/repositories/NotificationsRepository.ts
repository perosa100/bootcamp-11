import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'
import { getMongoRepository, MongoRepository } from 'typeorm'
import Notification from '../schemas/Notification'

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo')
  }

  public async create({
    content,
    recipient_id
  }: ICreateNotificationDTO): Promise<Notification> {
    const appointment = this.ormRepository.create({
      content,
      recipient_id
    })

    await this.ormRepository.save(appointment)

    return appointment
  }
}
export default NotificationsRepository
