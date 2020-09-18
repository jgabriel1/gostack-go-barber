import 'reflect-metadata'

import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import CreateUserService from './CreateUserService'

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const createUser = new CreateUserService(fakeUsersRepository)

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@doe.com',
      password: 'supersecret123',
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a new user with repeated e-mail', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const createUser = new CreateUserService(fakeUsersRepository)

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@doe.com',
      password: 'supersecret123',
    })

    const createUserWithSameEmail = createUser.execute({
      name: 'John Doe da Silva',
      email: 'johndoe@doe.com',
      password: 'supersecret123',
    })

    expect(createUserWithSameEmail).rejects.toBeInstanceOf(AppError)
  })
})
