import { ApiProperty } from '@nestjs/swagger';

class TransactionData {
  @ApiProperty()
  readonly _id: string;

  @ApiProperty()
  readonly userId: string;

  @ApiProperty()
  readonly paymentId: string;

  @ApiProperty()
  readonly amount: number;

  @ApiProperty()
  readonly transactionStatus: string;

  @ApiProperty()
  readonly paymentEmail: string;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty()
  readonly __v: number;

  @ApiProperty()
  readonly checkoutPaymentIntentId: string;
}

export class TransactionsResponseDto {
  @ApiProperty()
  readonly error: boolean;

  @ApiProperty()
  readonly statusCode: number;

  @ApiProperty()
  readonly message: string;

  @ApiProperty({ type: [TransactionData] })
  readonly data: TransactionData[];
}
