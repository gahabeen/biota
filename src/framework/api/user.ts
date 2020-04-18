import { FrameworkUser } from '~/types/framework/framework.user';
import { activity } from '~/framework/api/user/activity';
import { delete_ } from '~/framework/api/user/delete';
import { drop } from '~/framework/api/user/drop';
import { expireAt } from '~/framework/api/user/expireAt';
import { expireIn } from '~/framework/api/user/expireIn';
import { expireNow } from '~/framework/api/user/expireNow';
import { forget } from '~/framework/api/user/forget';
import { get } from '~/framework/api/user/get';
import { insert } from '~/framework/api/user/insert';
import { replace } from '~/framework/api/user/replace';
import { repsert } from '~/framework/api/user/repsert';
import { restore } from '~/framework/api/user/restore';
import { remember } from '~/framework/api/user/remember';
import { update } from '~/framework/api/user/update';
import { upsert } from '~/framework/api/user/upsert';
import { history } from '~/framework/api/user/history';

export const user: FrameworkUser = function (idOrRef) {
  const self = this;

  return {
    activity: activity.call(self, idOrRef),
    history: history.call(self, idOrRef),
    get: get.call(self, idOrRef),
    insert: insert.call(self, idOrRef),
    replace: replace.call(self, idOrRef),
    update: update.call(self, idOrRef),
    repsert: repsert.call(self, idOrRef),
    upsert: upsert.call(self, idOrRef),
    delete: delete_.call(self, idOrRef),
    forget: forget.call(self, idOrRef),
    drop: drop.call(self, idOrRef),
    restore: restore.call(self, idOrRef),
    remember: remember.call(self, idOrRef),
    expireAt: expireAt.call(self, idOrRef),
    expireIn: expireIn.call(self, idOrRef),
    expireNow: expireNow.call(self, idOrRef),
  };
};
