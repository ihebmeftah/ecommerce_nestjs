import { CategoryEntity } from 'src/category/entities/category.entity';
import { TimeStampEntity } from 'src/generics/db/timestamp.entity';
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('products')
export class ProductEntity extends TimeStampEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  desc: string;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;
  @Column()
  stock: number;
  @Column('simple-array')
  images: string[];
  @ManyToOne(() => UserEntity, (user) => user.products)
  addedBy: UserEntity;
  @ManyToOne(() => CategoryEntity, (cat) => cat.products)
  category: CategoryEntity;
  @OneToMany(() => ReviewEntity, (review) => review.product)
  reviews: ReviewEntity;
}
