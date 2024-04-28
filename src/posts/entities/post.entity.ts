import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostStatus } from '../interface/post-status.enum';
import { User } from '../../users/entities/user.entity';

@Entity('posts')
export class Post {
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

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
