import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolesModule as RolesAdminModule } from './admin/roles.module';

@Module({
  imports: [RolesAdminModule, TypeOrmModule.forFeature([Role])],
  exports: [RolesService],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
