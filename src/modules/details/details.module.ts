import { Module } from '@nestjs/common';
import { DetailsService } from './details.service';
import { DetailsController } from './details.controller';

@Module({
  providers: [DetailsService],
  controllers: [DetailsController]
})
export class DetailsModule {}
