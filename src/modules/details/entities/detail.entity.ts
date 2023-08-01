
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('details')
export class Detail {
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