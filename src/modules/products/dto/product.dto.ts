import { DetailEntity } from "@app/modules/details/entities";


export class ProductDTO {
  id: number;
  quantity_sold: number;
  quantity_inventory: number;
  detail: DetailEntity;
}