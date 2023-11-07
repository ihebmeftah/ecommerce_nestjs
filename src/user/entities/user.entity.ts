import { TimeStampEntity } from 'src/generics/db/timestamp.entity';
import { Roles } from 'src/generics/eum/user-role.enum';
import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity('users')
export class UserEntity extends TimeStampEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column({ select: false })
  password: string;
  @Column({ type: 'enum', enum: Roles, array: true, default: [Roles.USER] })
  role: Roles[];
}
