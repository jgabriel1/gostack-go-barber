import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import authConfig from '@config/auth'
import User from '../infra/typeorm/entities/User'
import IUsersRepository from '../repositories/IUsersRepository'

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: User
  token: string
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  private async getUserFromDatabase(email: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('Incorrect email or password!', 401)
    }

    return user
  }

  private async compareUserPassword(
    givenPasword: string,
    hashedPassword: string,
  ): Promise<void> {
    const passwordMatched = await compare(givenPasword, hashedPassword)

    if (!passwordMatched) {
      throw new AppError('Incorrect email or password!', 401)
    }
  }

  private generateSignedToken(userId: string): string {
    const { secret, expiresIn } = authConfig.jwt

    const token = sign({}, secret, {
      subject: userId,
      expiresIn,
    })

    return token
  }

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.getUserFromDatabase(email)

    await this.compareUserPassword(password, user.password)

    const token = this.generateSignedToken(user.id)

    return {
      user,
      token,
    }
  }
}

export default AuthenticateUserService
