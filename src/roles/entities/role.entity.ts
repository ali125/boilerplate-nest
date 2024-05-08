import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntityDB } from '../../model/database/base-entity.abstract';
import { User } from '../../users/entities/user.entity';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('roles')
export class Role extends BaseEntityDB {
  @Column({ length: 100 })
  title: string;

  @Column('text', { nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: false })
  superAdmin: boolean;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.roles)
  user: User;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  permissions: Permission[];
}
