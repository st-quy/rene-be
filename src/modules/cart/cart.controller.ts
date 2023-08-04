
import { Controller, Get, Post, Body, Patch, Delete, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDTO } from './dto/addtocart.dto';
import { CartProductEntity } from './entities/cartProduct.entity';
import { updateCartDTO } from './dto/updatetocart.dto';
import { CartEntity } from './entities';

@Controller('carts')
export class CartController {

  constructor(private readonly cartService: CartService) { }

  @Get()
  async getAllCarts() {
    return this.cartService.getAllCarts();
  }


  @Post('add')
  async addToCart(@Body() addToCartDTO: AddToCartDTO): Promise<CartProductEntity[]> {

    const cartProducts = await this.cartService.addToCart(addToCartDTO);

    return cartProducts;
  }


  @Patch('update')
  async updateCart(@Body() updateToCartDTO: updateCartDTO) {
    return await this.cartService.updateCart(updateToCartDTO);
  }

  @Delete('remove/:cartId/:productId')
  async removeFromCart(@Param('cartId') cartId: string, @Param('productId') productId: string): Promise<CartEntity> {
    const cart = await this.cartService.removeFromCart(cartId, productId);
    return cart;
  }


}





