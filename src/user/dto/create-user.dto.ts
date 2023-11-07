import { IsString } from 'class-validator';
import { UserSignInDto } from './sigin-user.dto';

export class CreateUserDto extends UserSignInDto {
  @IsString()
  name: string;
}
