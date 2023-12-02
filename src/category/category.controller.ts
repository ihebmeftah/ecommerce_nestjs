import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CurrentUser } from 'src/user/decoretors/currecnt-user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthentificationGuard } from 'src/user/guards/authentifcation.guards';
import { AuthorizeGuard } from 'src/user/guards/authorization.guards';
import { Roles } from 'src/generics/eum/user-role.enum';
import { CategoryEntity } from './entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // ADMIN AND CLIENT ONLY CAN SEE LIST OF PRODUCTS (LOGIN IS REQUIRED)
  @UseGuards(AuthentificationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() user: UserEntity,
  ) {
    return await this.categoryService.create(createCategoryDto, user);
  }

  // ADMIN AND CLIENT ONLY CAN SEE LIST OF PRODUCTS (LOGIN IS REQUIRED)
  @UseGuards(AuthentificationGuard)
  @Get()
  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryService.findAll();
  }

  // ADMIN AND CLIENT ONLY CAN SEE ONE PRODUCT (LOGIN IS REQUIRED)
  @UseGuards(AuthentificationGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CategoryEntity> {
    return await this.categoryService.findOne(+id);
  }

  // ADMIN ONLY CAN UPDATE PRODUCT (LOGIN IS REQUIRED)
  @UseGuards(AuthentificationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  // ADMIN ONLY CAN DELETE PRODUCT (LOGIN IS REQUIRED)
  @UseGuards(AuthentificationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
