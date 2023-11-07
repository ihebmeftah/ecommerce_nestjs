import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { UserSignInDto } from './dto/sigin-user.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}
  async accesstoken(user: UserEntity): Promise<string> {
    return await sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
    );
  }
  async signin(usersignin: UserSignInDto): Promise<UserEntity> {
    const userExist = await this.userRepo
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: usersignin.email })
      .getOne();
    if (!userExist)
      throw new HttpException('Bad creadentials Email', HttpStatus.BAD_REQUEST);
    const matchPassword = await compare(
      usersignin.password,
      userExist.password,
    );
    if (!matchPassword)
      throw new HttpException(
        'Bad creadentials password',
        HttpStatus.BAD_REQUEST,
      );
    delete userExist.password;
    return userExist;
  }
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userEmail = await this.findOneByEmail(createUserDto.email);
    if (userEmail)
      throw new HttpException(
        'User with this email : ' + userEmail.email + ' Exist',
        HttpStatus.BAD_REQUEST,
      );
    createUserDto.password = await hash(createUserDto.password, 10);
    let user = await this.userRepo.create(createUserDto);
    user = await this.userRepo.save(user);
    delete user.password;
    return user;
  }

  findAll(): Promise<UserEntity[]> {
    return this.userRepo.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepo.findOne({ where: { id: +id } });
    if (!user)
      throw new HttpException(
        'User with this id : ' + id + ' not found',
        HttpStatus.NOT_FOUND,
      );
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);
    updateUserDto.password = await hash(updateUserDto.password, 10);
    Object.assign(user, updateUserDto);
    return await this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepo.delete(user.id);
  }

  async deleteAll(): Promise<string> {
    this.userRepo.clear();
    return 'All users deleted';
  }
  async findOneByEmail(email: string): Promise<UserEntity> {
    return await this.userRepo.findOneBy({
      email: email,
    });
  }
}
