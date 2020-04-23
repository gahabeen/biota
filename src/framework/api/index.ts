import { activity } from '~/framework/api/index/activity';
import { delete_ } from '~/framework/api/index/delete';
import { drop } from '~/framework/api/index/drop';
import { expireAt } from '~/framework/api/index/expireAt';
import { expireIn } from '~/framework/api/index/expireIn';
import { expireNow } from '~/framework/api/index/expireNow';
import { forget } from '~/framework/api/index/forget';
import { get } from '~/framework/api/index/get';
import { insert } from '~/framework/api/index/insert';
import { replace } from '~/framework/api/index/replace';
import { repsert } from '~/framework/api/index/repsert';
import { restore } from '~/framework/api/index/restore';
import { update } from '~/framework/api/index/update';
import { upsert } from '~/framework/api/index/upsert';
import { inputStringLiteral } from '~/helpers/literals';
import { FrameworkIndex } from '~/types/framework/framework.index';

export const index: FrameworkIndex = function (...args) {
  const [indexName] = inputStringLiteral(args);

  return {
    activity: activity.call(this, indexName),
    get: get.call(this, indexName),
    insert: insert.call(this, indexName),
    replace: replace.call(this, indexName),
    update: update.call(this, indexName),
    repsert: repsert.call(this, indexName),
    upsert: upsert.call(this, indexName),
    delete: delete_.call(this, indexName),
    forget: forget.call(this, indexName),
    drop: drop.call(this, indexName),
    restore: restore.call(this, indexName),
    expireAt: expireAt.call(this, indexName),
    expireIn: expireIn.call(this, indexName),
    expireNow: expireNow.call(this, indexName),
  };
};
