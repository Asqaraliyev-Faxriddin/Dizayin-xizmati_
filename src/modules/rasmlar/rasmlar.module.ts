import { Module } from '@nestjs/common';
import { RasmlarService } from './rasmlar.service';
import { RasmlarController } from './rasmlar.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWTAccessOptions } from 'src/common/config/jwt';

@Module({
  imports:[JwtModule.register(JWTAccessOptions)],
  controllers: [RasmlarController],
  providers: [RasmlarService],
})
export class RasmlarModule {}
