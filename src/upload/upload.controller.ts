import { Controller, Get, Param } from '@nestjs/common';
import { UploadService } from './upload.service';
import { Public } from '@/decorators/public.decorator';

@Public()
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get(':dir/:file')
  findOne(@Param() params: string) {
    const path = `upload/${Object.values(params).join('/')}`;
    return this.uploadService.findOne(path);
  }
}
