import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { SmsService } from 'src/common/services/sms.service';
import { RedisService } from 'src/common/redis/redis.service';

@Module({
  controllers: [VerificationController],
  providers: [VerificationService, PrismaService, SmsService, RedisService],
  exports: [VerificationService],
})
export class VerificationModule {}
