import { Module } from '@nestjs/common';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { VerificationModule } from './modules/verification/verification.module';
import { RedisModule } from './common/redis/redis.module';
import { SeaderModule } from './common/seader/seader.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { ProfileModule } from './modules/profile/profile.module';
import { RasmlarModule } from './modules/rasmlar/rasmlar.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  PrismaModule, 
  AuthModule,  
  VerificationModule, 
  RedisModule,
  SeaderModule, 
  MailerModule, ProfileModule, RasmlarModule],

})
export class AppModule {}
