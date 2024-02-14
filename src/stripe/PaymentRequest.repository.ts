/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types, UpdateQuery } from 'mongoose';
import {
  PaymentRequestDocument,
  PaymentRequest,
} from './schema/payment-request-schema';
import { PagingOptions } from 'src/common/utils/pagination.dto';

@Injectable()
export class PaymentRequestRepository {
  constructor(
    @InjectModel(PaymentRequest.name)
    private model: Model<PaymentRequestDocument>,
  ) {}

  async create(
    createPaymentRequest: PaymentRequest,
  ): Promise<PaymentRequestDocument> {
    return this.model.create(createPaymentRequest);
  }

  async findOne(query: FilterQuery<PaymentRequestDocument>) {
    return this.model.findOne(query);
  }

  async findByUserId(
    userId: Types.ObjectId,
  ): Promise<PaymentRequestDocument[]> {
    return this.model.find({ OwnerId: userId });
  }

  async findByPaymentRequestId(
    id: Types.ObjectId,
  ): Promise<PaymentRequestDocument> {
    return this.model.findById(id);
  }

  async findByIdAndUpdate(
    id: Types.ObjectId,
    updateQuery?: UpdateQuery<Partial<PaymentRequest>>,
  ): Promise<PaymentRequestDocument> {
    return this.model.findOneAndUpdate({ _id: id }, updateQuery);
  }

  async save(
    PaymentRequest: PaymentRequestDocument,
  ): Promise<PaymentRequestDocument> {
    return PaymentRequest.save();
  }

  async find(
    findQuery?: FilterQuery<PaymentRequestDocument>,
    option?: PagingOptions,
    extra?: any,
  ): Promise<PaymentRequest[]> {
    return this.model
      .find(findQuery)
      .skip(option?.skip || 0)
      .limit(option?.limit || 5)
      .sort({ createdAt: -1 })
      .exec();
  }
}
