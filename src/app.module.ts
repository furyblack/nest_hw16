import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAccountsModule } from './moduls/user-accounts/user-accounts.module';
import { TestingModule } from './moduls/testing/testing.module';
import { BloggersPlatformModule } from './moduls/bloggers-platform/bloggers-platform.module';
import { CoreModule } from './core/core.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    UserAccountsModule,
    TestingModule,
    BloggersPlatformModule,
    CoreModule,
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
