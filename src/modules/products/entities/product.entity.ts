
import { Column,OneToOne, Entity, PrimaryGeneratedColumn,JoinColumn,ManyToMany,JoinTable, ManyToOne } from "typeorm";
import { Detail } from "../../details/entities/detail.entity";
@Entity('product')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity_sold: number;

    @Column()
    quantity_inventory: number;

    @OneToOne(() => Detail, { cascade: true, eager: true }) // This will cascade operations to the associated detail and eager load it
    @JoinColumn()
    detail: Detail;

}