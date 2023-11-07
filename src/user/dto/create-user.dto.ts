import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserSignInDto } from './sigin-user.dto';
import { Roles } from 'src/generics/eum/user-role.enum';

export class CreateUserDto extends UserSignInDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsEnum(Roles)
  role: Roles[];
}
