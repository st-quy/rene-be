
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { Product } from './entities';
import { CreateProductDTO } from './dto/createproduct.dto';
import { Detail } from '../details/entities';
import { UpdateProductDTO } from './dto/updateproduct.dto';
import { ProductDTO } from './dto/product.dto';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Detail)
    private readonly detailRepository: Repository<Detail>,
  ) {}
    private mapToProductDTO(product: Product): ProductDTO {
      return {
        id: product.id,
        quantity_sold: product.quantity_sold,
        quantity_inventory: product.quantity_inventory,
        detail: product.detail,
      };
    }
  async findAll(): Promise<ProductDTO[]> {
    const products = await this.productRepository.find({ relations: ['detail'] });
    return products.map(product => this.mapToProductDTO(product));
  }

  async findProductsSortedByPrice(sortOrder: 'ASC' | 'DESC'): Promise<ProductDTO[]> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    queryBuilder
      .innerJoinAndSelect('product.detail', 'detail')
      .orderBy('detail.price', sortOrder);

    const products = await queryBuilder.getMany();
    return products.map(product => this.mapToProductDTO(product));
  }
  async searchProductsByName(keyword: string): Promise<ProductDTO[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.detail', 'detail')
      .where('detail.product_name ILIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();

    if (!products || products.length === 0) {
      throw new NotFoundException('No products found');
    }

    return products.map(product => this.mapToProductDTO(product));
  }
  async findById(id: number): Promise<Product> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.detail', 'detail')
      .where('product.id = :id', { id })
      .getOne();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
  async createProduct(createProductDTO: CreateProductDTO) {
    const { product_name, brand, category, price, image, quantity_inventory } = createProductDTO;

    const newDetail = new Detail();
    newDetail.product_name = product_name;
    newDetail.brand = brand;
    newDetail.category = category;
    newDetail.price = price;
    newDetail.image = image;
    
    const savedDetail = await this.detailRepository.save(newDetail);

    const newProduct = new Product();
    newProduct.quantity_sold = 0;
    newProduct.quantity_inventory = quantity_inventory; 
    newProduct.detail = savedDetail;

    return await this.productRepository.save(newProduct);

  }
  
  async updateProduct(id: number, updateProductDTO: UpdateProductDTO): Promise<Product> {
    const product = await this.productRepository.findOne({where:{id}});
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const { product_name, brand, category, price, image, quantity_inventory,quantity_sold } = updateProductDTO;

    // Fetch the related detail entity
    const detail = product.detail || new Detail();
    detail.product_name = product_name || detail.product_name;
    detail.brand = brand || detail.brand;
    detail.category = category || detail.category;
    detail.price = price || detail.price;
    detail.image = image || detail.image;

    // Save the updated detail to the database
    const savedDetail = await this.detailRepository.save(detail);

    // Update the product entity directly
    product.quantity_inventory = quantity_inventory || product.quantity_inventory;
    product.quantity_sold = quantity_sold  || product.quantity_sold ;
    product.detail = savedDetail;

    // Save the updated product to the database
    return this.productRepository.save(product);
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.productRepository.findOne({where:{id}});
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.remove(product);
    throw new NotFoundException('Product deleted successfully');
  }
}
