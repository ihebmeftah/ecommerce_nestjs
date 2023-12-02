import { CategoryEntity } from 'src/category/entities/category.entity';
import { TimeStampEntity } from 'src/generics/db/timestamp.entity';
import { Roles } from 'src/generics/eum/user-role.enum';
import { ProductEntity } from 'src/product/entities/product.entity';
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';

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
  @OneToMany(() => CategoryEntity, (categorie) => categorie.addedBy)
  categories: CategoryEntity[];
  @OneToMany(() => ProductEntity, (product) => product.addedBy)
  products: ProductEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.user)
  reviews: ReviewEntity;
}
