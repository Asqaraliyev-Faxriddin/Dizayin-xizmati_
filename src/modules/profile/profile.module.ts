import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWTAccessOptions } from 'src/common/config/jwt';
import { AuthGuard } from 'src/common/guards/jwt-auth.gurads';

@Module({
  imports:[JwtModule.register(JWTAccessOptions)],
  controllers: [ProfileController],
  providers: [ProfileService,AuthGuard],
})
export class ProfileModule {}
