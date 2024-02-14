import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { PaymentRequestRepository } from './PaymentRequest.repository';
import Stripe from 'stripe';
import { InitiatePaymentDto } from './dto/initiatePayment.dto';
import { HandleError, HandleSuccess } from 'src/common/utils/response';
import { randomBytes } from 'crypto';
import { PaymentRequest } from './schema/payment-request-schema';
import { UserDocument } from 'src/users/schema/users-schema';
import { TransactionStatus } from './enums/payment-enum';

@Injectable()
export class StripeService {
  private config: Stripe.StripeConfig = null;
  private stripe: Stripe = new Stripe(
    this.configService.get('STRIPES_SK_TEST'),
    this.config,
  );
  constructor(
    private readonly configService: ConfigService,
    private paymentRequestRepository: PaymentRequestRepository,
    private readonly usersService: UsersService,
  ) {}

  async initiateCheckout(Id: string, paymentData: InitiatePaymentDto) {
    try {
      const user = await this.usersService.findById(Id);
      if (!user) {
        return HandleError({
          error: true,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User not found.',
          data: null,
        });
      }
      const userId = user._id;
      const paymentId = await this.generateSecureRandomString(12);
      const successUrl = 'https://www.google.com/';
      const cancelUrl = 'https://www.goal.com/en-ng';

      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `STRIPE-PAYMENT`,
              },

              unit_amount: paymentData.amount * 100,
            },
            quantity: paymentData.quantity,
          },
        ],
        mode: 'payment',
        metadata: {
          paymentId: `${paymentId}`,
          userId: `${userId}`,
        },
        success_url: `${successUrl}`,
        cancel_url: `${cancelUrl}`,
      });
      if (session) {
        await this.createPaymentRequest(
          user,
          session,
          paymentId,
          paymentData.amount,
        );

        return HandleSuccess({
          error: false,
          statusCode: HttpStatus.CREATED,
          message: 'checkout created successfully.',
          data: session,
        });
      }
    } catch (error) {
      console.log(error);
      return HandleError({
        error: true,
        status: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'An unexpected error occurred.',
      });
    }
  }

  private async createPaymentRequest(
    user: UserDocument,
    session: Stripe.Checkout.Session,
    paymentId: string,
    amount: number,
  ): Promise<PaymentRequest> {
    const paymentRequest = new PaymentRequest();
    paymentRequest.userId = user._id;
    paymentRequest.paymentId = paymentId;
    paymentRequest.amount = amount;
    paymentRequest.transactionStatus = TransactionStatus.Pending;
    paymentRequest.paymentEmail = user.email;

    return await this.paymentRequestRepository.create(paymentRequest);
  }

  private async generateSecureRandomString(length: number): Promise<string> {
    return randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  async processWebhookResponse(webHookResponseData) {
    const getUpdatedTransactionStatus =
      await this.paymentRequestRepository.findOne({
        paymentId: webHookResponseData.data.object.metadata.paymentId,
      });

    if (webHookResponseData.type === 'payment_intent.succeeded') {
      getUpdatedTransactionStatus.transactionStatus = TransactionStatus.Paid;
      await getUpdatedTransactionStatus.save();
    } else if (webHookResponseData.type === 'charge.failed') {
      getUpdatedTransactionStatus.transactionStatus = TransactionStatus.failed;
      await getUpdatedTransactionStatus.save();
    }
  }

  async processSessionCheckout(webhookResponse) {
    const getUpdatedTransactionStatus =
      await this.paymentRequestRepository.findOne({
        paymentId: webhookResponse.data.object.metadata.paymentId,
      });
    getUpdatedTransactionStatus.checkoutPaymentIntentId =
      webhookResponse.data.object.payment_intent;
    return getUpdatedTransactionStatus.save();
  }

  paymentSuccess(): string {
    return 'Payment Successful!!!!!';
  }

  paymentFailure(): string {
    return 'Payment Successful!!!!!';
  }
}
