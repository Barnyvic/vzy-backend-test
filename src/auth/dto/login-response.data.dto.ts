import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty()
  readonly error: boolean;

  @ApiProperty()
  readonly statusCode: number;

  @ApiProperty()
  readonly message: string;

  @ApiProperty()
  readonly data: any;
}
