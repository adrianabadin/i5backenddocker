
import {  Prisma } from '@prisma/client';
import { prismaClient } from '../Services/database.service';
import { logger } from '../Services/logger.service';
import {  PrismaError, UnknownPrismaError } from '../Services/prisma.errors';
import {  SignUpType } from '../auth/signUp.schema';
interface UserType {
  gender?: 'MALE' | 'FEMALE' | 'NOT_BINARY'
  id: string
  name: string
  lastName: string
  username: string
  phone: string
  hash: string | null
  birthDate: Date | null
  avatar?: string | null
  fbid?: string
  isVerified: boolean
  refreshToken?: string
  rol: 'GOD' | 'ADMIN' | 'WRITER' | 'USER'
  createdAt: Date
  updatedAt: Date
}

export class UsersService {
  constructor (protected prisma = prismaClient.prisma) {
    this.findById = this.findById.bind(this)
  }

  async findById (id: string): Promise<Prisma.UsersCreateInput & { rol: string, gender: string } | PrismaError> {
    try {
      const response = await this.prisma.users.findUniqueOrThrow(
        {
          where: { id }

        })
      const user = { ...response, rol: response.rol, gender: response.gender }
      return user as Prisma.UsersCreateInput & { rol: string, gender: string }
    } catch (error) {
      logger.error({ function: 'UsersService.findById', error })
      return new UnknownPrismaError(error)
    }
  }

  async findByUserName (username: string): Promise<Prisma.UsersCreateInput & { rol: string, gender: string } | PrismaError> {
    try {
      const response = await this.prisma.users.findUniqueOrThrow(
        {
          where: { username }

        })

      const user = { ...response, rol: response.rol, gender: response.gender }
      const returnType = user
      return returnType as Prisma.UsersCreateInput & { rol: string, gender: string }
    } catch (error) {
      logger.error({ function: 'UsersService.findById', error })
      return new UnknownPrismaError(error)
    }
  }

  async createUser (user: SignUpType & { hash: string, avatar?: string }, fbid?: string, accessToken?: string): Promise<Prisma.UsersCreateInput & { rol: string, gender: string } | PrismaError> {
    try {
      const response =
         await this.prisma.users.create(
           {
             data: {
               hash: user.hash,
               avatar: user.avatar,
               username: user.username,
               rol: fbid === undefined ? 'USER' : 'ADMIN',
               gender: user.gender === undefined ? 'NOT_BINARY' : user.gender,
               name: user.name,
               lastName: user.lastName,
               phone: user.phone,
               birthDate: user.birthDate,
               isVerified: fbid !== undefined,
               fbid,
               accessToken
             }
           })
      const responseType = { ...response, rol: response.rol as UserType['rol'], gender: response.gender as UserType['gender'] }
      return responseType as Prisma.UsersCreateInput & { rol: string, gender: string }
    } catch (error) {
      logger.error({ function: 'UsersService.createUser', error })
      return new UnknownPrismaError(error)
    }
  }
}
