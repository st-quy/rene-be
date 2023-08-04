import { ProductEntity } from "@app/modules/products/entities";
import { Column, Entity, PrimaryGeneratedColumn,OneToOne } from "typeorm";


@Entity('details')
export class DetailEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    product_name: string;

    @Column()
    brand: string;

    @Column()
    category: string;

    @Column()
    price: number;
   
    @Column()
    image: string;
   
    @OneToOne(() => ProductEntity, product => product.detail)
    product: ProductEntity;
}