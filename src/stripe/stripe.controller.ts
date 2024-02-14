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
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { InitiatePaymentDto } from './dto/initiatePayment.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import Stripe from 'stripe';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

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
  async getWebhook(
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
    } catch (err) {
      console.error(`Error message: ${err.message}`);
      response.status(400).send(`Webhook Error: ${err.message}`);
    }
    response.status(HttpStatus.OK).send();
  }
}
