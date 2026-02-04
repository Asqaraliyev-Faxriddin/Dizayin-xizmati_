import { Module } from '@nestjs/common';
import { SeederService } from './seader.service';


@Module({

  providers: [SeederService],
})
export class SeaderModule {}
