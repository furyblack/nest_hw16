import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from '../domain/session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async createSession(sessionData: {
    ip: string;
    title: string;
    deviceId: string;
    userId: string;
    lastActiveDate: Date;
  }) {
    await this.sessionModel.create({
      ...sessionData,
    });
  }

  async findSessionByDeviceId(deviceId: string) {
    return this.sessionModel.findOne({ deviceId }).exec();
  }

  async findSessionByDeviceIdAndDate(deviceId: string, iat: number) {
    const date = new Date(iat * 1000);
    return this.sessionModel
      .findOne({
        deviceId,
        lastActiveDate: {
          $gte: new Date(date.getTime() - 500), // -500 мс делаем для того чтоб пофиксить возможное не совпадения по мс
          $lte: new Date(date.getTime() + 500), // +500 мс
        },
      })
      .exec();
  }

  async deleteSessionByDeviceIdAndDate(
    deviceId: string,
    iat: number,
  ): Promise<void> {
    const result = await this.sessionModel
      .deleteOne({ deviceId, lastActiveDate: new Date(iat * 1000) })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Session not found');
    }
  }

  async updateSessionLastActiveDate(
    deviceId: string,
    oldIat: number,
    newIat: number,
  ) {
    const oldDate = new Date(oldIat * 1000);
    const newDate = new Date(newIat * 1000);

    const result = await this.sessionModel
      .updateOne(
        { deviceId, lastActiveDate: new Date(oldDate) },
        { $set: { lastActiveDate: new Date(newDate) } },
      )
      .exec();

    if (result.matchedCount === 0) {
      throw new NotFoundException('Session not found for update');
    }
  }

  async findAllSessionsForUser(userId: string) {
    return this.sessionModel.find({ userId }).exec();
  }

  async deleteAllOtherSessions(userId: string, currentDeviceId: string) {
    await this.sessionModel
      .deleteMany({
        userId,
        deviceId: { $ne: currentDeviceId },
      })
      .exec();
  }

  async terminateSpecificSession(
    userId: string,
    deviceId: string,
  ): Promise<void> {
    const session = await this.sessionModel
      .findOne({
        deviceId,
      })
      .exec();

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('Session does not belong to user');
    }

    await this.sessionModel
      .deleteOne({
        deviceId,
      })
      .exec();
  }
}
