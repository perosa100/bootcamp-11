import FakerUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'
import ListProviderService from './ListProviderService'

let fakeUserRepository: FakerUsersRepository
let listProvider: ListProviderService
let fakeCacheProvider: FakeCacheProvider

describe('ListProviderService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakerUsersRepository()
    fakeCacheProvider = new FakeCacheProvider()

    listProvider = new ListProviderService(
      fakeUserRepository,
      fakeCacheProvider
    )
  })

  it('Should be able to list the profile', async () => {
    const user1 = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    const user2 = await fakeUserRepository.create({
      name: 'John Trê',
      email: 'johntre@example.com',
      password: '123456'
    })

    const LoggedUser = await fakeUserRepository.create({
      name: 'John Qua',
      email: 'johnqua@example.com',
      password: '123456'
    })

    const providers = await listProvider.execute({
      user_id: LoggedUser.id
    })

    expect(providers).toEqual([user1, user2])
  })
})
