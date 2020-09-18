import AppError from '@shared/errors/AppError'

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'

import AuthenticateUserService from './AuthenticateUserService'

let fakeHashProvider: FakeHashProvider
let fakeUsersRepository: FakeUsersRepository

let authenticateUser: AuthenticateUserService

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider()
    fakeUsersRepository = new FakeUsersRepository()

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )
  })

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Gobarber User',
      email: 'user@gobarber.com',
      password: '123456'
    })

    const response = await authenticateUser.execute({
      email: 'user@gobarber.com',
      password: '123456'
    })

    expect(response).toHaveProperty('token')
    expect(response.user).toEqual(user)
  })

  it('should not be able to authenticate with inexistent user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'user@gobarber.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'Gobarber User',
      email: 'user@gobarber.com',
      password: '123456'
    })

    await expect(
      authenticateUser.execute({
        email: 'user@gobarber.com',
        password: 'abcdef'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
