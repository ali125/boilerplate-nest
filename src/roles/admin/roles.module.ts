import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { PermissionsModule } from '@/permissions/admin/permissions.module';
import { CaslModule } from '@/casl/casl.module';

@Module({
  imports: [CaslModule, PermissionsModule, TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
