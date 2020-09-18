import FakerUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import AppError from '@shared/errors/AppError'
import ShowProfileService from './ShowProfileService'

let fakeUserRepository: FakerUsersRepository
let showProfile: ShowProfileService

describe('ShowProfileService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakerUsersRepository()
    showProfile = new ShowProfileService(fakeUserRepository)
  })

  it('Should be able show the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    const profile = await showProfile.execute({
      user_id: user.id
    })

    expect(profile.name).toBe('John Doe')
    expect(profile.email).toBe('johndoe@example.com')
  })

  it('Should not be able show the profile from non-existing user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-existing-user-id'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
