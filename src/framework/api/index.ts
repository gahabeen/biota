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
import { FrameworkIndex } from '~/types/framework/framework.index';

export const index: FrameworkIndex = function (indexName = null) {
  const self = this;

  return {
    activity: activity.call(self, indexName),
    get: get.call(self, indexName),
    insert: insert.call(self, indexName),
    replace: replace.call(self, indexName),
    update: update.call(self, indexName),
    repsert: repsert.call(self, indexName),
    upsert: upsert.call(self, indexName),
    delete: delete_.call(self, indexName),
    forget: forget.call(self, indexName),
    drop: drop.call(self, indexName),
    restore: restore.call(self, indexName),
    expireAt: expireAt.call(self, indexName),
    expireIn: expireIn.call(self, indexName),
    expireNow: expireNow.call(self, indexName),
  };
};
