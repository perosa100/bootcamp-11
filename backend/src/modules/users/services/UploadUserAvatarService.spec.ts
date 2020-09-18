import FakerUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import UploadUserAvatarService from '@modules/users/services/UploadUserAvatarService'
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'
import AppError from '@shared/errors/AppError'

let fakeUserRepository: FakerUsersRepository
let fakeStorageProvider: FakeStorageProvider
let updateUserAvatar: UploadUserAvatarService
describe('UploadUserAvatar', () => {
  beforeEach(() => {
    fakeUserRepository = new FakerUsersRepository()
    fakeStorageProvider = new FakeStorageProvider()

    updateUserAvatar = new UploadUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider
    )
  })
  it('Should be able to create a new updateUserAvatar', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'teste@teste.com',
      password: '123123'
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg'
    })

    expect(user.avatar).toBe('avatar.jpg')
  })

  it('Should not be able to update avatar from non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'avatar.jpg'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('Should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile')

    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'teste@teste.com',
      password: '123123'
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg'
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg'
    })

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg')

    expect(user.avatar).toBe('avatar2.jpg')
  })
})
