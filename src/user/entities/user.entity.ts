import { Roles } from 'src/utils/user-role.enum';
import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column({ type: 'enum', enum: Roles, array: true, default: [Roles.USER] })
  role: Roles[];
}
