import { TimeStampEntity } from 'src/generics/db/timestamp.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class CategoryEntity extends TimeStampEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  desc: string;
  @ManyToOne(() => UserEntity, (user) => user.categories)
  addedBy: UserEntity;
}
/*
 user can create many categorie
 */
