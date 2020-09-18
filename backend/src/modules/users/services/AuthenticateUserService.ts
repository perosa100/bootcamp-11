import auth from '@config/auth'
import User from '@modules/users/infra/typeorm/entities/User'
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'
import AppError from '@shared/errors/AppError'
import { sign } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'
import IUsersRepository from '../repositories/IUsersRepository'

interface IRequest {
  email: string
  password: string
}
interface IResponse {
  user: User
  token: string
} // é igual isso Promise<{ user: User }> */

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401)
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password
    )

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination', 401)
    }

    const { secret, expiresIn } = auth.jwt

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn
    })

    return {
      user,
      token
    }
  }
}

export default AuthenticateUserService
