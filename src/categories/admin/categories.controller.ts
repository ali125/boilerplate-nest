import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { convertDataAccessQueryToDto } from '@/helper/string';
import { DataAccessQueryDTO } from '@/model/data-access/data-access.dto';
import { UserId } from '@/decorators/userId.decorator';
import { PoliciesGuard } from '@/casl/policy.guard';
import { CategoryPolicyHandler } from '@/casl/policy.interface';
import { CaslAction } from '@/casl/casl.enum';
import { CheckPolicies } from '@/casl/policy.decorator';

@UseGuards(PoliciesGuard)
@Controller('admin/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @CheckPolicies(new CategoryPolicyHandler(CaslAction.Create))
  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UserId() userId: string,
  ) {
    return this.categoriesService.create(userId, createCategoryDto);
  }

  @CheckPolicies(new CategoryPolicyHandler(CaslAction.Read))
  @Get()
  findAll(
    @Query()
    dataAccessListDto: DataAccessQueryDTO,
  ) {
    return this.categoriesService.findAll(
      convertDataAccessQueryToDto(dataAccessListDto),
    );
  }

  @CheckPolicies(new CategoryPolicyHandler(CaslAction.Read))
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }

  @CheckPolicies(new CategoryPolicyHandler(CaslAction.Update))
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @CheckPolicies(new CategoryPolicyHandler(CaslAction.Delete))
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }
}
