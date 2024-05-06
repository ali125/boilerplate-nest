import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { CategoryStatus } from '../interface/category-status.enum';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 100 })
  slug: string;

  @Column('text')
  description: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
