import { InjectModel } from '@nestjs/mongoose';
import {
  DeletionStatus,
  User,
  UserDocument,
  UserModelType,
} from '../domain/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class UsersRepository {
  //инжектирование модели через DI
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      _id: id,
      deletionStatus: { $ne: DeletionStatus.PermanentDeleted },
    });
  }

  async save(user: UserDocument) {
    await user.save();
  }
  async createUser(userData: {
    email: string;
    login: string;
    passwordHash: string;
  }): Promise<UserDocument> {
    const user = new this.UserModel(userData);
    return user.save();
  }

  async findOrNotFoundFail(id: Types.ObjectId): Promise<UserDocument> {
    const user = await this.findById(id.toString());

    if (!user) {
      //TODO: replace with domain exception
      throw new NotFoundException('user not found');
    }

    return user;
  }
  findByLogin(login: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ login });
  }
  async findByEmail(email: string) {
    return this.UserModel.findOne({ email }).exec();
  }
  async loginIsExist(login: string): Promise<boolean> {
    return !!(await this.UserModel.countDocuments({ login: login }));
  }
  async findByConfirmationCode(code: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ confirmationCode: code });
  }
}
