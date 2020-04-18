import { FrameworkToken } from '~/types/framework/framework.token';
import { activity } from '~/framework/api/token/activity';
import { delete_ } from '~/framework/api/token/delete';
import { drop } from '~/framework/api/token/drop';
import { expireAt } from '~/framework/api/token/expireAt';
import { expireIn } from '~/framework/api/token/expireIn';
import { expireNow } from '~/framework/api/token/expireNow';
import { forget } from '~/framework/api/token/forget';
import { get } from '~/framework/api/token/get';
import { insert } from '~/framework/api/token/insert';
import { replace } from '~/framework/api/token/replace';
import { repsert } from '~/framework/api/token/repsert';
import { restore } from '~/framework/api/token/restore';
import { update } from '~/framework/api/token/update';
import { upsert } from '~/framework/api/token/upsert';

export const token: FrameworkToken = function (idOrRefOrInstance) {
  const self = this;

  return {
    activity: activity.call(self, idOrRefOrInstance),
    get: get.call(self, idOrRefOrInstance),
    insert: insert.call(self, idOrRefOrInstance),
    replace: replace.call(self, idOrRefOrInstance),
    update: update.call(self, idOrRefOrInstance),
    repsert: repsert.call(self, idOrRefOrInstance),
    upsert: upsert.call(self, idOrRefOrInstance),
    delete: delete_.call(self, idOrRefOrInstance),
    forget: forget.call(self, idOrRefOrInstance),
    drop: drop.call(self, idOrRefOrInstance),
    restore: restore.call(self, idOrRefOrInstance),
    expireAt: expireAt.call(self, idOrRefOrInstance),
    expireIn: expireIn.call(self, idOrRefOrInstance),
    expireNow: expireNow.call(self, idOrRefOrInstance),
  };
};
