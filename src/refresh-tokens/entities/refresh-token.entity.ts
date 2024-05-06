import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BaseEntityDB } from '../../model/database/base-entity.abstract';

@Entity({ name: 'refreshTokens' })
export class RefreshToken extends BaseEntityDB {
  @Column()
  token: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  ip: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;
}
