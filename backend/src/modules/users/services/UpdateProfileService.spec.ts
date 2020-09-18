import FakerUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import AppError from '@shared/errors/AppError'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import UpdateProfileService from './UpdateProfileService'

let fakeUserRepository: FakerUsersRepository
let fakeHashProvider: FakeHashProvider
let updateProfile: UpdateProfileService

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakerUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    updateProfile = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider
    )
  })

  it('Should be able update the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johnre@example.com',
      password: '123456'
    })

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johnre@example.com'
    })

    expect(updateUser.name).toBe('John Trê')
    expect(updateUser.email).toBe('johnre@example.com')
  })

  it('Should not be able show the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        name: 'Test',
        email: 'test@example.com'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('Should not be able to change to another user email', async () => {
    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johnre@example.com',
      password: '123456'
    })

    const user = await fakeUserRepository.create({
      name: 'Test',
      email: 'test@example.com',
      password: '123456'
    })

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johnre@example.com'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
  // ok
  it('Should be able to update the password ', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })
    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johnre@example.com',
      old_password: '123456',
      password: '123123'
    })
    expect(updateUser.password).toBe('123123')
  })

  it('Should not be able to update the password without old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Trê',
        email: 'johntre@example.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('Should not be able to update the password with wrong old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Trê',
        email: 'johntre@example.com',
        old_password: 'wrong-old-password',
        password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
