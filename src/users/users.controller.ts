import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiOperation,
  ApiBody,
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserResponseDto } from 'src/auth/dto/user-response-data';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Update user by ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ type: UserResponseDto })
  @Put(':userId/update-user')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  update(
    @Param('userId') userId: string,
    @Body() updateUserData: UpdateUserDto,
  ) {
    return this.usersService.UpdateUser(userId, updateUserData);
  }
}
