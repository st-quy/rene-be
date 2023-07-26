
import { Column,OneToOne, Entity, PrimaryGeneratedColumn,JoinColumn,ManyToMany,JoinTable } from "typeorm";
import { DetailEntity } from "../../details/entities/detail.entity";
import { CartEntity } from "../../cart/entities/cart.entity";
@Entity('product')
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    detail : string;

    @Column()
    quantity_sold: number;

    @Column()
    quantity_invetory: number;

    @Column()
    created_at: Date;
   
    @OneToOne(() => DetailEntity, { cascade: true })
    @JoinColumn()
    detail_pro_det: DetailEntity;

    @ManyToMany(()  => CartEntity, { cascade: true })
    @JoinTable()
    cards: CartEntity[];
}