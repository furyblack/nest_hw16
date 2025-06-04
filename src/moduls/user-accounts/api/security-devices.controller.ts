import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from '../application/session.service';
import { ExtractUserFromRequest } from '../guards/decorators/param/extract-user-from-request.decorator';
import { Cookies } from '../decarators/cookies.decorator';
import { RefreshTokenGuardPower } from '../guards/bearer/refresh-guard v2.0';
import { UserContextDto } from '../guards/dto/user.context.dto';

@Controller('security')
export class SecurityDevicesController {
  constructor(
    private sessionService: SessionService,
    private jwtService: JwtService,
  ) {}

  @Get('devices')
  @UseGuards(RefreshTokenGuardPower)
  async getDevices(@ExtractUserFromRequest() user: UserContextDto) {
    const sessions = await this.sessionService.findAllSessionsForUser(
      user.userId,
    );
    return sessions.map((session) => ({
      ip: session.ip,
      title: session.title,
      lastActiveDate: new Date(session.lastActiveDate).toISOString(),
      deviceId: session.deviceId,
    }));
  }

  @Delete('devices')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenGuardPower)
  async terminateOtherSessions(
    @ExtractUserFromRequest() user: UserContextDto,
    @Cookies('refreshToken') refreshToken: string,
  ) {
    const payload = this.jwtService.verify(refreshToken);
    await this.sessionService.deleteAllOtherSessions(
      user.userId,
      payload.deviceId,
    );
    // Возвращаем 204 без тела
  }

  @Delete('devices/:deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenGuardPower)
  async terminateDevice(
    @ExtractUserFromRequest() user: UserContextDto,
    @Param('deviceId') deviceId: string,
    @Cookies('refreshToken') refreshToken: string,
  ) {
    const payload = this.jwtService.verify(refreshToken);

    await this.sessionService.terminateSpecificSession(
      user.userId,
      deviceId,
      payload.iat, // теперь передаём iat для проверки "своей" сессии
    );
    // Возвращаем 204 без тела
  }
}
