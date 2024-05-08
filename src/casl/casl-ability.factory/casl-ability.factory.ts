import { Post } from '@/posts/entities/post.entity';
import { User } from '@/users/entities/user.entity';
import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { CaslAction } from '../casl.enum';
import { Role } from '@/roles/entities/role.entity';
import { Category } from '@/categories/entities/category.entity';
import { Tag } from '@/tags/entities/tag.entity';

type Subjects =
  | InferSubjects<typeof Post | typeof Category | typeof Tag | typeof User>
  | 'all';

export type AppAbility = Ability<[CaslAction, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(role: Role | null) {
    const { can, build } = new AbilityBuilder<Ability<[CaslAction, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    if (role?.superAdmin) {
      can(CaslAction.Manage, 'all');
    } else {
      role.permissions.forEach((permission) => {
        switch (permission.module) {
          case Post.name:
            can(permission.action, Post);
            break;
          case Category.name:
            can(permission.action, Category);
            break;
          case Tag.name:
            can(permission.action, Tag);
            break;
          case User.name:
            can(permission.action, User);
            break;
        }
      });
    }
    // if (role?.superAdmin) {
    //   can(CaslAction.Manage, 'all');
    // } else {
    //   // can(CaslAction.Read, 'all');
    // }

    // can(CaslAction.Update, Post, { userId: user.id });
    // cannot(CaslAction.Delete, Post, { status: PostStatus.PUBLISHED });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
