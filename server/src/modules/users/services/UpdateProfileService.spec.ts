import AppError from '@shared/errors/AppError'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import UpdateProfileService from './UpdateProfileService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let updateProfile: UpdateProfileService

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    )
  })

  it("should be able to update a user's profile", async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'supersecret123',
    })

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'john@tre.com',
    })

    expect(updatedUser.name).toBe('John Trê')
    expect(updatedUser.email).toBe('john@tre.com')
  })

  it('should not be able to update a profile of a user that does not exist', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'inexistent-user-id',
        name: 'Test',
        email: 'test@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to update to an email that is already taken', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'supersecret123',
    })

    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'test@example.com',
      password: '123456',
    })

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'john@doe.com',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'supersecret123',
    })

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'john@tre.com',
      password: '123123',
      old_password: 'supersecret123',
    })

    expect(updatedUser.password).toBe('123123')
  })

  it('should not update password without also recieving the old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'supersecret123',
    })

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Trê',
        email: 'john@tre.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not update password when recieving a wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'supersecret123',
    })

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Trê',
        email: 'john@tre.com',
        password: '123123',
        old_password: 'wrong-old-password',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
