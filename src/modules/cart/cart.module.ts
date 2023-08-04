import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities';
import { ProductEntity } from '../products/entities';
import { CartProductEntity } from './entities/cartProduct.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity,ProductEntity,CartProductEntity])],
  providers: [CartService],
  controllers: [CartController]
})
export class CartModule {}
