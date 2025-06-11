import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { RegisterUserUseCase } from '../use-cases/register-user-use-case';

@Injectable()
export class UsersService {
  constructor(private registerUserUseCase: RegisterUserUseCase) {}

  async registerUser(dto: CreateUserDto): Promise<void> {
    return this.registerUserUseCase.execute(dto);
  }
}
