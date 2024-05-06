import { Injectable } from '@nestjs/common';

@Injectable()
export class TagsService {
  findAll() {
    return `This action returns all tags`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }
}
