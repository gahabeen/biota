import { FrameworkSession } from '~/types/framework/framework.session';
import { activity } from '~/framework/api/session/activity';
import { delete_ } from '~/framework/api/session/delete';
import { drop } from '~/framework/api/session/drop';
import { expireAt } from '~/framework/api/session/expireAt';
import { expireIn } from '~/framework/api/session/expireIn';
import { expireNow } from '~/framework/api/session/expireNow';
import { forget } from '~/framework/api/session/forget';
import { get } from '~/framework/api/session/get';
import { insert } from '~/framework/api/session/insert';
import { replace } from '~/framework/api/session/replace';
import { repsert } from '~/framework/api/session/repsert';
import { restore } from '~/framework/api/session/restore';
import { remember } from '~/framework/api/session/remember';
import { update } from '~/framework/api/session/update';
import { upsert } from '~/framework/api/session/upsert';
import { history } from '~/framework/api/session/history';
import { start } from '~/framework/api/session/start';
import { passport } from '~/framework/api/session/passport';
import { identity } from '~/framework/api/session/identity';

export const session: FrameworkSession = function (idOrRef) {
  const self = this;

  return {
    passport: passport.call(self, idOrRef),
    identity: identity.call(self, idOrRef),
    start: start.call(self, idOrRef),
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
