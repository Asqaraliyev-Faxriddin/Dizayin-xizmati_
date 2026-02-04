import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWTAccessOptions } from 'src/common/config/jwt';
import { VerificationModule } from '../verification/verification.module';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { RedisService } from 'src/common/redis/redis.service';
import { MailerModule } from 'src/common/node-mailer/mailer.module';

@Module({
  imports:[JwtModule.register({...JWTAccessOptions}),VerificationModule,MailerModule],
  controllers: [AuthController],
  providers: [AuthService,PrismaService,RedisService]
})
export class AuthModule {}
