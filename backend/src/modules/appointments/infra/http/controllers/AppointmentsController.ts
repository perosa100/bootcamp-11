import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export default class AppointmentController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id
    const { provider_id, date } = request.body
    // isso se torna obsoleto se usar container
    /*   const appointmentRepository = new AppointmentsRepository()
  const createAppointment = new CreateAppointmentService(appointmentRepository)
 */
    const createAppointment = container.resolve(CreateAppointmentService)
    const appointment = await createAppointment.execute({
      date,
      provider_id,
      user_id
    })

    return response.json(appointment)
  }
}
