import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { TagStatus } from '../interface/tag-status.enum';
import { BaseEntityDB } from '../../model/database/base-entity.abstract';

@Entity('tags')
export class Tag extends BaseEntityDB {
  @Column({ length: 100 })
  title: string;

  @Column({ length: 100 })
  slug: string;

  @Column('text', { nullable: true })
  description: string | null;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.tags)
  user: User;

  @ManyToMany(() => Post, (post) => post.tags, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  posts: Post[];

  @Column({
    type: 'enum',
    enum: TagStatus,
    default: TagStatus.ACTIVE,
  }) // default value is Active
  status: string;
}
