import { ProductEntity } from "@app/modules/products/entities";
import { Column, Entity, PrimaryGeneratedColumn, Timestamp,ManyToMany, OneToMany,JoinTable } from "typeorm";
import { CartProductEntity } from "./cartProduct.entity";


@Entity('carts')
export class CartEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    total_price: number;

    @Column()
    total_quantity: number;

    @Column()
    created_at: Date;

    @ManyToMany(() => ProductEntity, product => product.carts)
    @JoinTable({
        name: "carts_products",
        joinColumn: {
            name: "cartId",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "productId",
            referencedColumnName: "id",
        }
    })
    products: ProductEntity[]; 
    @OneToMany(type => CartProductEntity, cartProduct => cartProduct.carts)
    cartProducts: CartProductEntity[];

  }