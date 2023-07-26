import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


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

}