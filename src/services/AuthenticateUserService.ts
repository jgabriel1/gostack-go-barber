import { getRepository } from 'typeorm'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import User from '../models/User'

interface Request {
  email: string
  password: string
}

interface Response {
  user: User
  token: string
}

class AuthenticateUserService {
  private async getUserFromDatabase(email: string): Promise<User> {
    const usersRepository = getRepository(User)

    const user = await usersRepository.findOne({ where: { email } })

    if (!user) {
      throw new Error('Incorrect email or password!')
    }

    return user
  }

  private async compareUserPassword(
    givenPasword: string,
    hashedPassword: string,
  ): Promise<void> {
    const passwordMatched = await compare(givenPasword, hashedPassword)

    if (!passwordMatched) {
      throw new Error('Incorrect email or password!')
    }
  }

  private generateSignedToken(userId: string): string {
    const token = sign({}, 'supersecret123', {
      subject: userId,
      expiresIn: '1d',
    })

    return token
  }

  public async execute({ email, password }: Request): Promise<Response> {
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
