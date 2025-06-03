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
    lastActiveDate: string;
  }) {
    await this.sessionModel.create({
      ...sessionData,
    });
  }

  async findSessionByDeviceId(deviceId: string) {
    return this.sessionModel.findOne({ deviceId }).exec();
  }

  async findSessionByDeviceIdAndDate(deviceId: string, iat: number) {
    return this.sessionModel
      .findOne({
        deviceId,
        lastActiveDate: iat,
      })
      .exec();
  }

  async deleteSessionByDeviceIdAndDate(
    deviceId: string,
    iat: number,
  ): Promise<void> {
    const result = await this.sessionModel
      .deleteOne({ deviceId, lastActiveDate: iat })
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
    const result = await this.sessionModel
      .updateOne(
        { deviceId, lastActiveDate: oldIat },
        { $set: { lastActiveDate: newIat } },
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
    iat: number,
  ): Promise<void> {
    const session = await this.sessionModel
      .findOne({
        deviceId,
        lastActiveDate: iat,
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
        lastActiveDate: iat,
      })
      .exec();
  }
}
