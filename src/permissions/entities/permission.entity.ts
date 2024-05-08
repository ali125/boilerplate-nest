import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { CaslAction } from '../../casl/casl.enum';
import { BaseEntityDB } from '../../model/database/base-entity.abstract';
import { Role } from '../../roles/entities/role.entity';

@Entity('permissions')
export class Permission extends BaseEntityDB {
  @Column({ length: 100 })
  module: string;

  @Column({ type: 'enum', enum: CaslAction, default: CaslAction.Manage }) // default value is Manage
  action: CaslAction;

  @ManyToMany(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
  @JoinTable()
  roles: Role[];
}
