import { IsString, IsEmail, Length } from 'class-validator';

export class UserSignInDto {
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @Length(8, 255)
  password: string;
}
