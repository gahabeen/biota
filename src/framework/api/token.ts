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

export const token: FrameworkToken = function (idOrInstance) {
  const self = this;

  return {
    activity: activity.call(self, idOrInstance),
    get: get.call(self, idOrInstance),
    insert: insert.call(self, idOrInstance),
    replace: replace.call(self, idOrInstance),
    update: update.call(self, idOrInstance),
    repsert: repsert.call(self, idOrInstance),
    upsert: upsert.call(self, idOrInstance),
    delete: delete_.call(self, idOrInstance),
    forget: forget.call(self, idOrInstance),
    drop: drop.call(self, idOrInstance),
    restore: restore.call(self, idOrInstance),
    expireAt: expireAt.call(self, idOrInstance),
    expireIn: expireIn.call(self, idOrInstance),
    expireNow: expireNow.call(self, idOrInstance),
  };
};
