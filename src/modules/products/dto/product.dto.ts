import { Detail } from "@app/modules/details/entities";


export class ProductDTO {
  id: number;
  quantity_sold: number;
  quantity_inventory: number;
  detail: Detail;
}