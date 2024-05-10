import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { PostStatus } from '../interface/post-status.enum';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { BaseEntityDB } from '../../model/database/base-entity.abstract';

@Entity('posts')
export class Post extends BaseEntityDB {
  @Column({ length: 100 })
  title: string;

  @Column({ length: 100 })
  slug: string;

  @Column({ length: 255, nullable: true })
  imageUrl: string | null;

  @Column('text', { nullable: true })
  description: string | null;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @Column({
    nullable: true,
  })
  categoryId: string | null;

  @ManyToOne(() => Category, (category) => category.posts)
  category: Category;

  @ManyToMany(() => Tag, (tag) => tag.posts)
  tags: Tag[];

  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.DRAFT }) // default value is Draft
  status: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publishedAt: Date | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  blockedAt: Date | null;
}
