import { Column,OneToOne, Entity, PrimaryGeneratedColumn,PrimaryColumn,JoinColumn,ManyToMany,JoinTable ,ManyToOne} from "typeorm";
import { DetailEntity } from "../../details/entities/detail.entity";
import { CartEntity } from "../../cart/entities/cart.entity";
import { ProductEntity } from "@app/modules/products/entities";

  @Entity('carts_products')
  export class CartProductEntity {
      @PrimaryColumn({ name: 'cartId'})
      cartId: string;
    
      @PrimaryColumn({ name: 'productId' })
      productId: string;

      @Column({ default: 1 })
      quantity: number;

      @ManyToOne(() => ProductEntity, product => product.cartProducts)
      @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
      products: ProductEntity[];

      @ManyToOne(() => CartEntity, cart => cart.cartProducts)
      @JoinColumn({ name: 'cartId', referencedColumnName: 'id' })
      carts: CartEntity[];

      
  }

