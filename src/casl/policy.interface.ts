import { AppAbility } from './casl-ability.factory/casl-ability.factory';
import { CaslAction } from './casl.enum';
import { Post } from '@/posts/entities/post.entity';
import { Category } from '@/categories/entities/category.entity';
import { Tag } from '@/tags/entities/tag.entity';
import { User } from '@/users/entities/user.entity';

interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export class PostPolicyHandler implements IPolicyHandler {
  constructor(private action: CaslAction) {}
  handle(ability: AppAbility) {
    return ability.can(this.action, Post);
  }
}

export class CategoryPolicyHandler implements IPolicyHandler {
  constructor(private action: CaslAction) {}
  handle(ability: AppAbility) {
    return ability.can(this.action, Category);
  }
}

export class TagPolicyHandler implements IPolicyHandler {
  constructor(private action: CaslAction) {}
  handle(ability: AppAbility) {
    return ability.can(this.action, Tag);
  }
}

export class UserPolicyHandler implements IPolicyHandler {
  constructor(private action: CaslAction) {}
  handle(ability: AppAbility) {
    return ability.can(this.action, User);
  }
}
