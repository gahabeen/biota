import { activity } from '~/framework/api/session/activity';
import { delete_ } from '~/framework/api/session/delete';
import { drop } from '~/framework/api/session/drop';
import { expireAt } from '~/framework/api/session/expireAt';
import { expireIn } from '~/framework/api/session/expireIn';
import { expireNow } from '~/framework/api/session/expireNow';
import { forget } from '~/framework/api/session/forget';
import { get } from '~/framework/api/session/get';
import { history } from '~/framework/api/session/history';
import { identity } from '~/framework/api/session/identity';
import { insert } from '~/framework/api/session/insert';
import { passport } from '~/framework/api/session/passport';
import { remember } from '~/framework/api/session/remember';
import { replace } from '~/framework/api/session/replace';
import { repsert } from '~/framework/api/session/repsert';
import { restore } from '~/framework/api/session/restore';
import { start } from '~/framework/api/session/start';
import { update } from '~/framework/api/session/update';
import { upsert } from '~/framework/api/session/upsert';
import { inputStringLiteral } from '~/helpers/literals';
import { FrameworkSession } from '~/types/framework/framework.session';

export const session: FrameworkSession = function (...args) {
  const [id] = inputStringLiteral(args);

  return {
    passport: passport.call(this, id),
    identity: identity.call(this, id),
    start: start.call(this, id),
    activity: activity.call(this, id),
    history: history.call(this, id),
    get: get.call(this, id),
    insert: insert.call(this, id),
    replace: replace.call(this, id),
    update: update.call(this, id),
    repsert: repsert.call(this, id),
    upsert: upsert.call(this, id),
    delete: delete_.call(this, id),
    forget: forget.call(this, id),
    drop: drop.call(this, id),
    restore: restore.call(this, id),
    remember: remember.call(this, id),
    expireAt: expireAt.call(this, id),
    expireIn: expireIn.call(this, id),
    expireNow: expireNow.call(this, id),
  };
};
