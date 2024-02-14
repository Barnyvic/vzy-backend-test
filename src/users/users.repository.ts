/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { User, UserDocument } from './schema/users-schema';
import { CreateUserDto } from './dto/create-user-dto';
import { PagingOptions } from '../common/utils/pagination.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private model: Model<UserDocument>,
  ) {}

  public async create(UserDto: CreateUserDto): Promise<UserDocument> {
    return this.model.create(UserDto);
  }

  public async find(
    findQuery?: FilterQuery<UserDocument>,
    option?: PagingOptions,
    extra?: any,
  ): Promise<UserDocument[]> {
    return this.model
      .find(findQuery)
      .skip(option?.skip)
      .limit(option?.limit)
      .exec();
  }

  public async findById(id: Types.ObjectId): Promise<UserDocument> {
    return this.model.findById(id);
  }

  public async findOne(query: FilterQuery<UserDocument>) {
    return this.model.findOne(query).exec();
  }

  public async findOneProfile(query: FilterQuery<UserDocument>) {
    const document = await this.model.findOne(query);
    return document ? document.toObject() : null;
  }

  public async updateOne(
    id: Types.ObjectId,
    updateQuery: UpdateQuery<Partial<UserDocument>>,
  ): Promise<UserDocument> {
    return this.model.findOneAndUpdate({ _id: id }, updateQuery, {
      new: true,
    });
  }

  public async delete(query: FilterQuery<UserDocument>) {
    return this.model.findByIdAndDelete(query);
  }

  async save(user: UserDocument): Promise<UserDocument> {
    return user.save();
  }
}
