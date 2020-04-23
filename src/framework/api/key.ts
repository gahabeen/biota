import { activity } from '~/framework/api/key/activity';
import { delete_ } from '~/framework/api/key/delete';
import { drop } from '~/framework/api/key/drop';
import { expireAt } from '~/framework/api/key/expireAt';
import { expireIn } from '~/framework/api/key/expireIn';
import { expireNow } from '~/framework/api/key/expireNow';
import { forget } from '~/framework/api/key/forget';
import { get } from '~/framework/api/key/get';
import { insert } from '~/framework/api/key/insert';
import { replace } from '~/framework/api/key/replace';
import { repsert } from '~/framework/api/key/repsert';
import { restore } from '~/framework/api/key/restore';
import { update } from '~/framework/api/key/update';
import { upsert } from '~/framework/api/key/upsert';
import { inputStringLiteral } from '~/helpers/literals';
import { FrameworkKey } from '~/types/framework/framework.key';

export const key: FrameworkKey = function (...args) {
  const [keyName] = inputStringLiteral(args);

  return {
    activity: activity.call(this, keyName),
    get: get.call(this, keyName),
    insert: insert.call(this, keyName),
    replace: replace.call(this, keyName),
    update: update.call(this, keyName),
    repsert: repsert.call(this, keyName),
    upsert: upsert.call(this, keyName),
    delete: delete_.call(this, keyName),
    forget: forget.call(this, keyName),
    drop: drop.call(this, keyName),
    restore: restore.call(this, keyName),
    expireAt: expireAt.call(this, keyName),
    expireIn: expireIn.call(this, keyName),
    expireNow: expireNow.call(this, keyName),
  };
};
