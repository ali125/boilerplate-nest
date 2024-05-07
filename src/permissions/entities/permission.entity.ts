import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { CaslAction } from '../../casl/casl.enum';
import { BaseEntityDB } from '../../model/database/base-entity.abstract';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';

@Entity('permissions')
export class Permission extends BaseEntityDB {
  @Column({ length: 100 })
  module: string;

  @Column({ type: 'enum', enum: CaslAction, default: CaslAction.Manage }) // default value is Manage
  action: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.permissions)
  user: User;
}
