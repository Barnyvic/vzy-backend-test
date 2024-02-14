import { Injectable, HttpStatus } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user-dto';
import { ApiResponse } from '../common/utils/response';
import { hashPassword } from '../common/utils/auth.helper';
import { Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<ApiResponse<any>> {
    try {
      const existingUser = await this.usersRepository.findOne({
        email: createUserDto.email,
      });

      if (existingUser) {
        return {
          error: true,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'You already have an existing account. Please login.',
          data: null,
        };
      }

      const hashedPassword = await hashPassword(createUserDto.password);

      const createdUser = await this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      return {
        error: false,
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully.',
        data: createdUser,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'An unexpected error occurred.',
        data: null,
      };
    }
  }

  async findById(id: string) {
    const user = await this.usersRepository.findById(new Types.ObjectId(id));
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    return user;
  }

  async UpdateUser(userId: string, updateUserData: UpdateUserDto) {
    try {
      const user = await this.usersRepository.findById(
        new Types.ObjectId(userId),
      );

      if (!user) {
        return {
          error: true,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User not found.',
          data: null,
        };
      }

      const updatedUser = await this.usersRepository.updateOne(
        new Types.ObjectId(userId),
        updateUserData,
      );

      return {
        error: false,
        statusCode: HttpStatus.OK,
        message: 'User updated successfully.',
        data: updatedUser,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'An unexpected error occurred.',
        data: null,
      };
    }
  }
}
