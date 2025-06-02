import { UsersService } from '../application/users.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express'; // Импортируем Response из express
import { CreateUserInputDto } from './input-dto/users.input-dto';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { AuthService } from '../application/auth.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthQueryRepository } from '../infrastructure/query/auth.query-repository';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../guards/dto/user.context.dto';
import { MeViewDto } from './view-dto/user.view-dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
  ConfirmRegistrationDto,
  PasswordRecoveryDto,
} from '../dto/confirm-registration-dto';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private authQueryRepository: AuthQueryRepository,
  ) {}

  @UseGuards(ThrottlerGuard)
  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  registration(@Body() body: CreateUserInputDto): Promise<void> {
    return this.usersService.registerUser(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(
    @ExtractUserFromRequest() user: UserContextDto,
    @Res({ passthrough: true }) response: Response, // Используем @Res для установки cookie
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.login(user.id);

    // Устанавливаем refreshToken в cookie
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Защита от XSS
      secure: true, // В production используем HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    // Возвращаем accessToken в теле ответа
    return { accessToken };
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
    return this.authQueryRepository.me(user.id);
  }

  @UseGuards(ThrottlerGuard)
  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmRegistration(
    @Body() dto: ConfirmRegistrationDto,
  ): Promise<void> {
    await this.authService.confirmRegistration(dto.code);
  }
  @UseGuards(ThrottlerGuard)
  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() dto: PasswordRecoveryDto): Promise<void> {
    await this.authService.passwordRecovery(dto.email);
  }
  @UseGuards(ThrottlerGuard)
  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async emailResending(@Body() dto: PasswordRecoveryDto): Promise<void> {
    await this.authService.emailResending(dto.email);
  }
}
