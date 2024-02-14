import { ApiProperty } from '@nestjs/swagger';

class UserData {
  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly role: string;

  @ApiProperty()
  readonly isDeleted: boolean;

  @ApiProperty()
  readonly active: boolean;

  @ApiProperty()
  readonly isVerified: boolean;

  @ApiProperty()
  readonly _id: string;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty()
  readonly __v: number;

  @ApiProperty()
  readonly id: string;
}

export class UserResponseDto {
  @ApiProperty()
  readonly error: boolean;

  @ApiProperty()
  readonly statusCode: number;

  @ApiProperty()
  readonly message: string;

  @ApiProperty({ type: UserData })
  readonly data: UserData;
}
