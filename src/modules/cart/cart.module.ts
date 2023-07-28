import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities';
import { Detail } from '../details/entities';
import { Cart } from './entities';

@Module({
  imports:[TypeOrmModule.forFeature([Product,Detail,Cart])],
  providers: [CartService],
  controllers: [CartController]
})
export class CartModule {}
