import { Post } from '@/posts/entities/post.entity';
import { AppAbility } from './casl-ability.factory/casl-ability.factory';
import { CaslAction } from './casl.enum';

interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export class ReadArticlePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(CaslAction.Read, Post);
  }
}
