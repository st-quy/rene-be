import { Module } from '@nestjs/common';
import { DetailsService } from './details.service';
import { DetailsController } from './details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities';
import { Detail } from './entities';
import { Cart } from '../cart/entities';

@Module({
  imports:[TypeOrmModule.forFeature([Product,Detail,Cart])],
  providers: [DetailsService],
  controllers: [DetailsController]
})
export class DetailsModule {}
