import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentRequestSchema,
  PaymentRequest,
} from './schema/payment-request-schema';
import { UsersModule } from 'src/users/users.module';
import { StripeService } from './stripe.service';
import { PaymentRequestRepository } from './PaymentRequest.repository';
import { StripeController } from './stripe.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PaymentRequest.name,
        schema: PaymentRequestSchema,
      },
    ]),
    forwardRef(() => AuthModule),
    UsersModule,
  ],
  providers: [StripeService, PaymentRequestRepository],
  controllers: [StripeController],
})
export class StripeModule {}
