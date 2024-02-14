import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { TransactionStatus } from '../enums/payment-enum';

export type PaymentRequestDocument = PaymentRequest & Document;

@Schema({ timestamps: true, strict: false })
export class PaymentRequest {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    index: true,
    ref: 'User',
  })
  userId: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.String,
    index: true,
  })
  checkoutPaymentIntentId: string;

  @Prop({
    type: MongooseSchema.Types.String,
    index: true,
  })
  paymentId: string;

  @Prop({
    type: MongooseSchema.Types.Number,
  })
  amount: number;

  @Prop({
    type: MongooseSchema.Types.String,
    enum: TransactionStatus,
    index: true,
  })
  transactionStatus: TransactionStatus;

  @Prop({
    type: MongooseSchema.Types.String,
  })
  paymentEmail: string;
}
export const PaymentRequestSchema =
  SchemaFactory.createForClass(PaymentRequest);
