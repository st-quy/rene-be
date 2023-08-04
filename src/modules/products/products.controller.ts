
import { Controller } from '@nestjs/common';


import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDTO } from './dto/product.dto';
import { CreateProductDTO } from './dto/createproduct.dto';
import { Product } from './entities';
import { UpdateProductDTO } from './dto/updateproduct.dto';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query('sortBy') sortBy: string, @Query('search') search: string): Promise<ProductDTO[]> {
    if (search) {
      // Nếu có tham số search, thực hiện tìm kiếm sản phẩm theo tên
      return this.productsService.searchProductsByName(search);
    }
    
    let products: ProductDTO[];


    if (sortBy === 'asc') {
      // Lọc sản phẩm từ giá thấp đến cao
      products = await this.productsService.findProductsSortedByPrice('ASC');
    } else if (sortBy === 'desc') {
      // Lọc sản phẩm từ giá cao đến thấp
      products = await this.productsService.findProductsSortedByPrice('DESC');
    } else {
      // Mặc định, không lọc, trả về tất cả sản phẩm
      products = await this.productsService.findAll();
    }

    return products;
  }
  // @Get('search')
  // async searchProductsByName(@Query('keyword') keyword: string): Promise<ProductDTO[]> {
  //   if (!keyword) {
  //     throw new NotFoundException('Keyword must be provided');
  //   }

  //   return this.productsService.searchProductsByName(keyword);
  // }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ProductDTO> {
    try {
      const product = await this.productsService.findById(id);
      return {
        id: product.id,
        quantity_sold: product.quantity_sold,
        quantity_inventory: product.quantity_inventory,
        detail: product.detail,
      };
    } catch (error) {
      throw new NotFoundException('Product not found');
    }
  }

  @Post()
  async createProduct(@Body() createProductDTO: CreateProductDTO) {
    return this.productsService.createProduct(createProductDTO);
  }
  @Patch(':id')
  async updateProduct(@Param('id') id: number, @Body() updateProductDTO: UpdateProductDTO) {
    return this.productsService.updateProduct(id, updateProductDTO);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    return this.productsService.deleteProduct(id);
  }
}

