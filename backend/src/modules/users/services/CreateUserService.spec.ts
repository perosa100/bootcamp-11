import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import FakerUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import CreateUserService from '@modules/users/services/CreateUserService'
import AppError from '@shared/errors/AppError'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

let fakeUserRepository: FakerUsersRepository
let fakeHashProvider: FakeHashProvider
let createUser: CreateUserService
let fakeCacheProvider: FakeCacheProvider

describe('CreateAppointmentService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakerUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    fakeCacheProvider = new FakeCacheProvider()

    createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider
    )
  })

  it('Should be able to create a new appointment', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'teste@teste.com',
      password: '123123'
    })

    expect(user).toHaveProperty('id')
  })

  it('Should not  be able to create a new user with same email from another', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'teste@teste.com',
      password: '123123'
    })

    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'teste@teste.com',
        password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
