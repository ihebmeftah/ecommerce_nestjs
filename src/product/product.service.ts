import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    private readonly categoryServices: CategoryService,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    const category = await this.categoryServices.findOne(
      +createProductDto.categoryId,
    );
    const product = await this.productRepo.create(createProductDto);
    product.category = category;
    product.addedBy = currentUser;
    return await this.productRepo.save(product);
  }

  async findAll(): Promise<ProductEntity[]> {
    return await this.productRepo.find();
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: {
        addedBy: true,
        category: true,
      },
    });
    if (!product)
      throw new HttpException(
        'Porduct with this id : ' + id + ' not found',
        HttpStatus.NOT_FOUND,
      );

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    const product = await this.productRepo.findOne({
      where: { id },
    });
    if (!product)
      throw new HttpException(
        'Product with this id : ' + id + ' not found',
        HttpStatus.NOT_FOUND,
      );
    if (updateProductDto.categoryId) {
      const category = await this.categoryServices.findOne(
        +updateProductDto.categoryId,
      );
      product.category = category;
    }
    Object.assign(product, updateProductDto);
    const productupdated = await this.productRepo.save(product);
    return productupdated;
  }

  async remove(id: number) {
    const product = await this.findOne(+id);
    return await this.productRepo.delete(product.id);
  }
}
