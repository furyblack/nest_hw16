import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users.repository';
import { MeViewDto } from '../../api/view-dto/user.view-dto';

@Injectable()
export class AuthQueryRepository {
  constructor(private usersRepository: UsersRepository) {}

  async me(userId: string): Promise<MeViewDto> {
    const user = await this.usersRepository.findOrNotFoundFail(userId);
    console.log('returned from /me', MeViewDto.mapToView(user));
    return MeViewDto.mapToView(user);
  }
}
