import { FrameworkIndexApi } from '~/types/framework/framework.index';
import { activity } from '~/framework/api/index/activity';
import { delete_ } from '~/framework/api/index/delete';
import { forget } from '~/framework/api/index/forget';
import { get } from '~/framework/api/index/get';
import { insert } from '~/framework/api/index/insert';
import { replace } from '~/framework/api/index/replace';
import { repsert } from '~/framework/api/index/repsert';
import { update } from '~/framework/api/index/update';
import { upsert } from '~/framework/api/index/upsert';
import { drop } from '~/framework/api/index/drop';
import { restore } from '~/framework/api/index/restore';
import { expireAt } from '~/framework/api/index/expireAt';
import { expireIn } from '~/framework/api/index/expireIn';
import { expireNow } from '~/framework/api/index/expireNow';

export function index(indexName: string): FrameworkIndexApi {
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
}
