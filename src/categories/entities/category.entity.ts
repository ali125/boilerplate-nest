import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { CategoryStatus } from '../interface/category-status.enum';
import { BaseEntityDB } from '../../model/database/base-entity.abstract';

@Entity('categories')
export class Category extends BaseEntityDB {
  @Column({ length: 100 })
  title: string;

  @Column({ length: 100 })
  slug: string;

  @Column('text', { nullable: true })
  description: string | null;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.categories)
  user: User;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];

  @Column({ nullable: true })
  parentId: string | true;

  @ManyToOne(() => Category, (category) => category.children)
  parent: Category | null;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @Column({
    type: 'enum',
    enum: CategoryStatus,
    default: CategoryStatus.ACTIVE,
  }) // default value is Active
  status: string;
}
