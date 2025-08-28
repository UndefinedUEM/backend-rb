import { Module } from '@nestjs/common';
import { AccessCodeController } from './access-code.controller';
import { AccessCodeService } from './access-code.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [AccessCodeController],
  providers: [AccessCodeService],
})
export class AccessCodeModule {}
