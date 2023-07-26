import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from "typeorm";
@Entity('cart')
export class  CartEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    product: string;

    @Column()
    total_price: number;

    @Column()
    quantity: number;

    @Column()
    created_at: Date;
}