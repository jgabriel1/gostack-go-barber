import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import User from '../infra/typeorm/entities/User'
import IUsersRepository from '../repositories/IUsersRepository'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'

interface IRequest {
  user_id: string
  name: string
  email: string
  old_password?: string
  password?: string
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  private async checkIfEmailIsAvailable(
    email: string,
    user_id: string,
  ): Promise<void> {
    const anotherUserWithUpdatedEmail = await this.usersRepository.findByEmail(
      email,
    )

    if (
      anotherUserWithUpdatedEmail &&
      anotherUserWithUpdatedEmail.id !== user_id
    ) {
      throw new AppError('This e-mail is already being used.')
    }
  }

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User not found.', 404)
    }

    await this.checkIfEmailIsAvailable(email, user_id)

    user.name = name
    user.email = email

    if (password && !old_password) {
      throw new AppError('You need to inform the old password to set a new one')
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      )

      if (!checkOldPassword) {
        throw new AppError('Old password does not match.')
      }

      user.password = await this.hashProvider.generateHash(password)
    }

    return this.usersRepository.save(user)
  }
}

export default UpdateProfileService
