import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class InitiatePaymentDto {
  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'Amount must be a non-negative number' })
  amount: number;

  @ApiProperty()
  @IsNumber()
  @Min(0, { message: 'quantity must be a non-negative number' })
  quantity: number;
}
