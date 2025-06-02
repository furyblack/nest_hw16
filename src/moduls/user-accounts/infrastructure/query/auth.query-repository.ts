import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users.repository';
import { Types } from 'mongoose';
import { MeViewDto } from '../../api/view-dto/user.view-dto';

@Injectable()
export class AuthQueryRepository {
  constructor(private usersRepository: UsersRepository) {}

  async me(userId: string): Promise<MeViewDto> {
    const user = await this.usersRepository.findOrNotFoundFail(
      new Types.ObjectId(userId),
    );

    return MeViewDto.mapToView(user);
  }
}
