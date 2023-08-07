

import { Column,OneToOne, Entity, PrimaryGeneratedColumn,JoinColumn,ManyToMany,OneToMany,JoinTable } from "typeorm";
import { DetailEntity } from "../../details/entities/detail.entity";
import { CartEntity } from "../../cart/entities/cart.entity";
import { CartProductEntity } from "@app/modules/cart/entities/cartProduct.entity";


@Entity('products')
export class ProductEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()

    quantity_sold: number;


    @Column()
    quantity_inventory: number;


    @Column()
    created_at: Date;

    @OneToOne(() => DetailEntity)
    @JoinColumn()
    detail: DetailEntity;

    @ManyToMany(() => CartEntity, cart => cart.products)
    carts: CartEntity[];

      
    @OneToMany(() => CartProductEntity, cartProduct => cartProduct.products) // Đảm bảo quan hệ đúng với tên bảng trung gian
    cartProducts: CartProductEntity[];

}