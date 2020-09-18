import 'reflect-metadata'

import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'

import AuthenticateUserService from './AuthenticateUserService'
import CreateUserService from './CreateUserService'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@doe.com',
      password: 'supersecret123',
    })

    const response = await authenticateUser.execute({
      email: 'johndoe@doe.com',
      password: 'supersecret123',
    })

    expect(response).toHaveProperty('token')
  })
})
