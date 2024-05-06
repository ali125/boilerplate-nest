import { Column, Entity, OneToMany } from 'typeorm';
import { Expose } from 'class-transformer';
import { UserStatus } from '../interfaces/user-status.enum';
import { RefreshToken } from '../../refresh-tokens/entities/refresh-token.entity';
import { Post } from '../../posts/entities/post.entity';
import { Category } from '../../categories/entities/category.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { BaseEntityDB } from '../../model/database/base-entity.abstract';

@Entity('users')
export class User extends BaseEntityDB {
  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({
    length: 15,
    unique: true,
    nullable: true,
  })
  mobile: string;

  @Column({
    length: 100,
    select: false,
  })
  password: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: string;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  blockedAt: Date | null;

  // Define a getter method for the virtual column
  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
