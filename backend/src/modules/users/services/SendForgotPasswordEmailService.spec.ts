import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'
import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository'
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let fakeMailProvider: FakeMailProvider
let sendForgotPasswordEmail: SendForgotPasswordEmailService

describe('SendForgotPasswordEmailPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeMailProvider = new FakeMailProvider()
    fakeUserTokensRepository = new FakeUserTokensRepository()

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    )
  })

  it('Should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'teste@teste.com',
      password: '123123'
    })

    await sendForgotPasswordEmail.execute({
      email: 'teste@teste.com'
    })

    expect(sendMail).toHaveBeenCalled()
  })

  it('Should be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'teste@teste.com'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('Should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate')

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'teste@teste.com',
      password: '123123'
    })

    await sendForgotPasswordEmail.execute({
      email: 'teste@teste.com'
    })

    expect(generateToken).toHaveBeenCalledWith(user.id)
  })
})
