import { Product } from "@app/modules/products/entities";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
@Entity('cart')
export class  Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total_price: number;

  @Column()
  quantity: number;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

}