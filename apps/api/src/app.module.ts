import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '@modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envSchema } from './config/env/env.schema';
import { EnvModule } from './config/env/env.module';
import { JwtModule } from '@shared/infra/security/jwt/jwt.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@shared/infra/security/jwt/guards/jwt-auth.guard';
import { NotificationModule } from '@modules/notifications/notification.module';
import { BullModule } from '@nestjs/bullmq';
import { ProfileModule } from '@modules/profile/profile.module';
import { SocialModule } from '@modules/social/social.module';
import { MediaModule } from '@modules/media/media.module';
import { AccountModule } from '@modules/account/account.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    EnvModule,
    CqrsModule.forRoot(),
    JwtModule,
    AccountModule,
    AuthModule,
    NotificationModule,
    ProfileModule,
    SocialModule,
    MediaModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
