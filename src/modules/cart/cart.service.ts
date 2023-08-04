import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entities';
import { ProductEntity } from '../products/entities';
import { CartProductEntity } from './entities/cartProduct.entity';
import { Repository, SimpleConsoleLogger } from 'typeorm';
import { AddToCartDTO } from './dto/addtocart.dto';
import { updateCartDTO } from './dto/updatetocart.dto';


@Injectable()
export class CartService {

    constructor(
        @InjectRepository(CartEntity)
        private readonly cartRepository: Repository<CartEntity>,

        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        @InjectRepository(CartProductEntity)
        private readonly cartProductRepository: Repository<CartProductEntity>,
    ) { }

    async getAllCarts(): Promise<any[]> {

        const carts = await this.cartRepository.createQueryBuilder('cart')
            .leftJoinAndSelect('cart.cartProducts', 'cartProduct')
            .leftJoinAndSelect('cartProduct.products', 'product')
            .leftJoinAndSelect('product.detail', 'detail')
            .select([
                'cart.id',
                'cart.total_price',
                'cart.total_quantity',
                'cart.created_at',
                'cartProduct.quantity', // Lấy trường "quantity" từ bảng trung gian "carts_products"
                'product.id',
                'product.quantity_sold',
                'product.quantity_inventory',
                'product.created_at',
                'detail.id',
                'detail.product_name',
                'detail.brand',
                'detail.category',
                'detail.price',
                'detail.image',
            ])
            .getMany();


        const formattedCarts = carts.map((cart) => {
            // Sắp xếp mảng cart.cartProducts theo thứ tự tăng dần của id sản phẩm
            cart.cartProducts.sort((a, b) => Number(a.productId) - Number(b.productId));

            const products = []; // Mảng để lưu tất cả các sản phẩm trong giỏ hàng

            cart.cartProducts.forEach((cartProduct) => {
                const product = cartProduct.products;
                const quantity = cartProduct.quantity;

                products.push({
                    ...product,
                    quantity: quantity,
                });
            });
            // Sắp xếp mảng products theo thứ tự tăng dần của id sản phẩm
            products.sort((a, b) => a.id - b.id);
            return {
                id: cart.id,
                total_price: cart.total_price,
                total_quantity: cart.total_quantity,
                created_at: cart.created_at,
                products: products,
            };
        });

        return formattedCarts;

    }


    async addToCart(addToCartDTO: AddToCartDTO): Promise<CartProductEntity[]> {
        const { cartId, productId } = addToCartDTO;


        // Lấy thông tin sản phẩm trong giỏ hàng
        let cartProduct = await this.cartProductRepository
            .createQueryBuilder('cartProduct')
            .leftJoinAndSelect('cartProduct.products', 'product')
            .leftJoinAndSelect('product.detail', 'detail')
            .where('cartProduct.cartId = :cartId', { cartId })
            .andWhere('cartProduct.productId = :productId', { productId })
            .getOne();

        // Lấy thông tin sản phẩm
        let product = await this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.detail', 'detail')
            .where('product.id = :productId', { productId })
            .getOne();

        // Lấy thông tin giỏ hàng tương ứng từ bảng Cart
        let cart = await this.cartRepository
            .createQueryBuilder('cart')
            .leftJoinAndSelect('cart.cartProducts', 'cartProduct')
            .where('cart.id = :cartId', { cartId })
            .getOne();

        if (!cart) {
            // Nếu giỏ hàng chưa tồn tại, tạo mới giỏ hàng và thêm sản phẩm vào giỏ hàng
            cart = new CartEntity();
            cart.id = cartId;
            // cart.total_quantity = 0;
            cart.total_price = 0;
            cart.created_at = new Date();
            await this.cartRepository.save(cart);

            // Tạo mới đối tượng CartProductEntity và thêm sản phẩm vào giỏ hàng
            const cartProduct = new CartProductEntity();
            cartProduct.quantity = 1;
            cartProduct.carts = [];
            cartProduct.products = [];
            await this.cartProductRepository.save(cartProduct);

            // Cập nhật thông tin của giỏ hàng
            cart.total_quantity += 1;
            cart.total_price += product.detail.price;
            await this.cartRepository.save(cart);
        }


        if (cartProduct) {
            // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng sản phẩm lên
            cartProduct.quantity += 1;
            await this.cartProductRepository.save(cartProduct);

            // cart.total_quantity += 1;    
            cart.total_price += product.detail.price * cartProduct.quantity;
            await this.cartRepository.save(cart);

        }
        else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới sản phẩm vào giỏ hàng
            const newCartProduct = new CartProductEntity();
            newCartProduct.cartId = cartId;
            newCartProduct.productId = productId;
            newCartProduct.quantity = 1;
            // Lấy thông tin giỏ hàng tương ứng
            let cart = await this.cartRepository
                .createQueryBuilder('cart')
                .leftJoinAndSelect('cart.cartProducts', 'cartProduct')
                .where('cart.id = :cartId', { cartId })
                .getOne();
            // Thêm newCartProduct vào mảng cartProducts của cart
            cart.cartProducts.push(newCartProduct);

            // Gán giá trị cho mảng products
            await this.cartProductRepository.save(newCartProduct);


            // Cập nhật thông tin của giỏ hàng
            cart.total_quantity += 1;

            cart.total_price += product.detail.price;
            await this.cartRepository.save(cart);
        }

        // Lấy danh sách sản phẩm trong giỏ hàng và trả về
        const cartProducts = await this.cartProductRepository.find({
            where: { cartId: cartId },
            relations: ['cart','cart.products','products.detail']
        });

        return cartProducts;
    }


    async updateCart(updateCartDTO: updateCartDTO): Promise<CartEntity> {
        const { cartId, productId, operation } = updateCartDTO;

        let cartProduct = await this.cartProductRepository
            .createQueryBuilder('cartProduct')
            .where('cartProduct.cartId = :cartId', { cartId })
            .andWhere('cartProduct.productId = :productId', { productId })
            .getOne();

        // Lấy thông tin sản phẩm
        let product = await this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.detail', 'detail')
            .where('product.id = :productId', { productId })
            .getOne();

        // Lấy thông tin giỏ hàng tương ứng từ bảng Cart
        let cart = await this.cartRepository
            .createQueryBuilder('cart')
            .where('cart.id = :cartId', { cartId })
            .getOne();

        if (operation === 'add') {

            cartProduct.quantity += 1;

            cart.total_price += product.detail.price;


        } else if (operation === 'remove') {
            cartProduct.quantity -= 1;
            cart.total_price -= product.detail.price;
        }

        await this.cartRepository.save(cart);
        await this.cartProductRepository.save(cartProduct);

        return cart;
    }

    async removeFromCart(cartId: string, productId: string): Promise<CartEntity> {

        let cartProduct = await this.cartProductRepository
            .createQueryBuilder('cartProduct')
            .where('cartProduct.cartId = :cartId', { cartId })
            .andWhere('cartProduct.productId = :productId', { productId })
            .getOne();

        // Lấy thông tin giỏ hàng tương ứng từ bảng Cart
        let cart = await this.cartRepository
            .createQueryBuilder('cart')
            .where('cart.id = :cartId', { cartId })
            .getOne();

        // Lấy thông tin sản phẩm
        let product = await this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.detail', 'detail')
            .where('product.id = :productId', { productId })
            .getOne();

        if (cartProduct) {
            // Xóa cartProduct khỏi bảng trung gian
            await this.cartProductRepository.remove(cartProduct);

            // Cập nhật tổng giá trị và tổng số lượng trong giỏ hàng
            cart.total_price -= product.detail.price * cartProduct.quantity;
            cart.total_quantity -= 1;
            // Lưu lại cart sau khi đã cập nhật
            await this.cartRepository.save(cart);
        }
       
        return cart;
    }
}









