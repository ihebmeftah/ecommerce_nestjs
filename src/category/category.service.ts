import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}
  async create(
    createCategoryDto: CreateCategoryDto,
    userEntity: UserEntity,
  ): Promise<CategoryEntity> {
    const category = await this.categoryRepo.create(createCategoryDto);
    category.addedBy = userEntity;
    return await this.categoryRepo.save(category);
  }

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepo.find();
  }

  async findOne(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: {
        addedBy: true,
      },
      select: {
        addedBy: { name: true },
      },
    });
    if (!category)
      throw new HttpException(
        'Category with this id : ' + id + ' not found',
        HttpStatus.NOT_FOUND,
      );
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    const categoryUpaded = await this.categoryRepo.save(category);
    return categoryUpaded;
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    return await this.categoryRepo.delete(category.id);
  }
}
