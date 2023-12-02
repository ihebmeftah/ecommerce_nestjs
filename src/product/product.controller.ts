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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CurrentUser } from 'src/user/decoretors/currecnt-user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthentificationGuard } from 'src/user/guards/authentifcation.guards';
import { Roles } from 'src/generics/eum/user-role.enum';
import { AuthorizeGuard } from 'src/user/guards/authorization.guards';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  // ADMIN ONLY CAN CREATE PRODUCT (LOGIN IS REQUIRED)
  @UseGuards(AuthentificationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return this.productService.create(createProductDto, currentUser);
  }

  // ADMIN AND CLIENT CAN SEE LIST OF PRODUCTS (LOGIN IS REQUIRED)
  @UseGuards(AuthentificationGuard)
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  // ADMIN AND CLIENT CAN SEE ONE PRODUCT (LOGIN IS REQUIRED)
  @UseGuards(AuthentificationGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  // ADMIN ONLY CAN UPDATE PRODUCT (LOGIN IS REQUIRED)
  @UseGuards(AuthentificationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  // ADMIN ONLY CAN DELETE PRODUCT (LOGIN IS REQUIRED)
  @UseGuards(AuthentificationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
