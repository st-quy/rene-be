// src/modules/products/dtos/create-product.dto.ts

export class CreateProductDTO {
  product_name: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  quantity_inventory: number; // Include the quantity_inventory field in the DTO
}
