import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { CaslModule } from '@/casl/casl.module';
import { UsersModule } from '@/users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { TagsModule } from '@/tags/admin/tags.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload/posts',
    }),
    TypeOrmModule.forFeature([Post]),
    CaslModule,
    UsersModule,
    TagsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
