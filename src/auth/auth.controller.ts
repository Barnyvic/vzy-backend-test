import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UserResponseDto } from './dto/user-response-data';
import { LoginResponseDto } from './dto/login-response.data.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ type: UserResponseDto })
  @Post('signup')
  signUpUser(@Body() signUpDto: CreateUserDto) {
    return this.authService.createUser(signUpDto);
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid email or password' })
  @Post('login')
  login(@Body() loginDto: LoginUserDto) {
    return this.authService.LoginUser(loginDto);
  }
}
