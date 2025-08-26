import { Module } from '@nestjs/common';
import { AchivenemntsService } from './achivenemnts.service';
import { AchivenemntsController } from './achivenemnts.controller';

@Module({
  controllers: [AchivenemntsController],
  providers: [AchivenemntsService],
})
export class AchivenemntsModule {}
