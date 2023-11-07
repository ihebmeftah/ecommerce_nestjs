import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/sigin-user.dto';
import { CurrentUser } from 'src/decoretors/currecnt-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('signin')
  async sigin(
    @Body() userSignin: UserSignInDto,
  ): Promise<{ accesstoken: string; user: UserEntity }> {
    const user = await this.userService.signin(userSignin);
    const accesstoken = await this.userService.accesstoken(user);
    return await { accesstoken, user };
  }
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<UserEntity[]> {
    return await this.userService.findAll();
  }
  @Get('me')
  async getme(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    return user;
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return await this.userService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(+id);
  }

  @Delete()
  async deleteAll() {
    return await this.userService.deleteAll();
  }
}
