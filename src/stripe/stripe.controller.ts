/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  Headers,
  Res,
  Req,
  RawBodyRequest,
  HttpStatus,
  Inject,
  Get,
  Query,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { InitiatePaymentDto } from './dto/initiatePayment.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOkResponse,
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import Stripe from 'stripe';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { PagingOptions } from 'src/common/utils/pagination.dto';
import { TransactionsResponseDto } from './dto/all-transactions-response.dto';

@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
  private readonly client: Stripe;
  constructor(
    private readonly stripeService: StripeService,
    @Inject(ConfigService) private readonly config: ConfigService,
  ) {
    this.client = new Stripe(this.config.get('STRIPES_SK_TEST'), {
      typescript: true,
    });
  }

  @Post('/:userId/initialize-payment')
  @ApiOkResponse({
    description: 'initialize payment',
  })
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async submitDriverApplication(
    @Body() paymentRequestBody: InitiatePaymentDto,
    @Param('userId') userId: 'string',
  ) {
    return this.stripeService.initiateCheckout(userId, paymentRequestBody);
  }

  @Post('/webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
    @Res() response: Response,
  ) {
    let event: Stripe.Event;

    try {
      event = this.client.webhooks.constructEvent(
        req.rawBody,
        signature,
        this.config.get('STRIPE_WEBHOOK_SECRET'),
      );

      switch (event.type) {
        case 'checkout.session.completed':
          await this.stripeService.processSessionCheckout(event);
          break;
        case 'charge.succeeded':
        case 'charge.failed':
          await this.stripeService.processWebhookResponse(event);
          break;
        default:
          break;
      }

      response.status(HttpStatus.OK).send();
    } catch (err) {
      console.error('Webhook processing error:', err);
      response.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
  @Get('success')
  paymentSuccess(): string {
    return this.stripeService.paymentSuccess();
  }

  @Get('failure')
  paymentFailure(): string {
    return this.stripeService.paymentFailure();
  }

  @Get('/paid-transactions')
  @ApiResponse({ type: TransactionsResponseDto })
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async getAllPaidTransactions(@Query() options: PagingOptions) {
    return this.stripeService.getAllPaidTransactions(options);
  }
}
