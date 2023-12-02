import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from './entities/review.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewrepo: Repository<ReviewEntity>,
    private readonly productservice: ProductService,
  ) {}
  async create(
    createReviewDto: CreateReviewDto,
    currentUser: UserEntity,
  ): Promise<ReviewEntity> {
    const product = await this.productservice.findOne(
      createReviewDto.productId,
    );
    let review = await this.findOneByUserandProducr(
      currentUser.id,
      createReviewDto.productId,
    );

    if (!review) {
      review = await this.reviewrepo.create(createReviewDto);
      review.user = currentUser;
      review.product = product;
    } else {
      review.ratings = createReviewDto.ratings;
      review.comments = createReviewDto.comments;
    }
    return await this.reviewrepo.save(review);
  }

  async findOneByUserandProducr(userId: number, productId: number) {
    return await this.reviewrepo.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
      relations: {
        user: true,
        product: { category: true },
      },
    });
  }

  async findAll(productId: number): Promise<ReviewEntity[]> {
    if (productId) {
      return await this.reviewrepo.find({
        where: {
          product: { id: productId },
        },
      });
    }
    return await this.reviewrepo.find();
  }

  async findOne(id: number): Promise<ReviewEntity> {
    const review = await this.reviewrepo.findOne({
      where: { id },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });
    if (!review)
      throw new NotFoundException('review with id : ' + id + 'not found');
    return review;
  }

  /* update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }
*/
  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
