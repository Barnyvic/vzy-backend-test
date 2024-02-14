import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { verifyPassword } from 'src/common/utils/auth.helper';
import { HandleError, HandleSuccess } from 'src/common/utils/response';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  async LoginUser(data: LoginUserDto) {
    const user = await this.userService.findByEmail(data.email);
    if (!user || !(await verifyPassword(data.password, user.password))) {
      return HandleError({
        error: true,
        status: HttpStatus.BAD_REQUEST,
        message: 'invalid email or password',
      });
    }

    const payload = { id: user._id, email: user.email };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
    return HandleSuccess(token, HttpStatus.OK, 'Login successful');
  }
}
