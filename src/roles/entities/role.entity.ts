import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntityDB } from '../../model/database/base-entity.abstract';
import { User } from '../../users/entities/user.entity';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('roles')
export class Role extends BaseEntityDB {
  @Column({ length: 100 })
  title: string;

  @Column('text')
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  permissions: Permission[];
}
