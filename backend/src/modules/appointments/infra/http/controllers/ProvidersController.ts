import { classToClass } from 'class-transformer'
import ListProviderService from '@modules/appointments/services/ListProviderService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export default class AppointmentController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id

    const listProvider = container.resolve(ListProviderService)
    const providers = await listProvider.execute({
      user_id
    })

    return response.json(classToClass(providers))
  }
}
