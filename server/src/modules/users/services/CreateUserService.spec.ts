import 'reflect-metadata'

import AppError from '@shared/errors/AppError'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import CreateUserService from './CreateUserService'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let fakeCacheProvider: FakeCacheProvider
let createUser: CreateUserService

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    fakeCacheProvider = new FakeCacheProvider()

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    )
  })

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@doe.com',
      password: 'supersecret123',
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a new user with repeated e-mail', async () => {
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

    await expect(createUserWithSameEmail).rejects.toBeInstanceOf(AppError)
  })
})
