import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { LocalStrategy } from './guards/local/local.strategy';
import { CryptoService } from './application/crypto.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import { AuthQueryRepository } from './infrastructure/query/auth.query-repository';
import { CreateUserUseCase } from './use-cases/create-user-use-case';
import { RegisterUserUseCase } from './use-cases/register-user-use-case';
import { DeleteUserUseCase } from './use-cases/delete-user-use-case';
import { SecurityDevicesController } from './api/security-devices.controller';
import { SecurityDevicesQueryRepository } from './infrastructure/query/security-devices.query-repository';

@Module({
  imports: [
    JwtModule.register({
      secret: 'access-token-secret', //TODO: move to env. will be in the following lessons
      signOptions: { expiresIn: '60m' }, // Время жизни токена
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationsModule,
  ],
  controllers: [UsersController, AuthController, SecurityDevicesController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    SecurityDevicesQueryRepository,
    AuthService,
    AuthQueryRepository,
    LocalStrategy,
    CryptoService,
    JwtStrategy,
    CreateUserUseCase,
    RegisterUserUseCase,
    DeleteUserUseCase,
  ],

  exports: [
    UsersRepository,
    MongooseModule,
    JwtStrategy,
    /* MongooseModule реэкспорт делаем, если хотим чтобы зарегистрированные здесь модельки могли
    инджектиться в сервисы других модулей, которые импортнут этот модуль */
  ],
})
export class UserAccountsModule {}
