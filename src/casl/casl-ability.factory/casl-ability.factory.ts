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
import { PostStatus } from '@/posts/interface/post-status.enum';

type Subjects = InferSubjects<typeof Post | typeof User> | 'all';

export type AppAbility = Ability<[CaslAction, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[CaslAction, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.email === 'ali.mortazavi121@gmail.com') {
      can(CaslAction.Manage, 'all');
    } else {
      can(CaslAction.Read, 'all');
    }

    can(CaslAction.Update, Post, { userId: user.id });
    cannot(CaslAction.Delete, Post, { status: PostStatus.PUBLISHED });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
