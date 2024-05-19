import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Expose } from 'class-transformer';
import { UserStatus } from '../interfaces/user-status.enum';
import { RefreshToken } from '../../refresh-tokens/entities/refresh-token.entity';
import { Post } from '../../posts/entities/post.entity';
import { Category } from '../../categories/entities/category.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { BaseEntityDB } from '../../model/database/base-entity.abstract';
import { Role } from '../../roles/entities/role.entity';

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

  @Column({ length: 255, nullable: true })
  avatarUrl: string | null;

  @Column('text', { nullable: true })
  about: string | null;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: string;

  @Column({ length: 200, nullable: true })
  resetToken: string | null;
  @Column({
    type: 'timestamp',
    nullable: true,
  })
  resetTokenExpires: Date | null;

  @Column({ nullable: true })
  roleId: string | null;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  @OneToMany(() => Role, (role) => role.user)
  roles: Role[];

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
