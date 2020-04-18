import { FrameworkKeyApi } from '~/types/framework/framework.key';
import { activity } from '~/framework/api/key/activity';
import { delete_ } from '~/framework/api/key/delete';
import { forget } from '~/framework/api/key/forget';
import { get } from '~/framework/api/key/get';
import { insert } from '~/framework/api/key/insert';
import { replace } from '~/framework/api/key/replace';
import { repsert } from '~/framework/api/key/repsert';
import { update } from '~/framework/api/key/update';
import { upsert } from '~/framework/api/key/upsert';
import { drop } from '~/framework/api/key/drop';
import { restore } from '~/framework/api/key/restore';
import { expireAt } from '~/framework/api/key/expireAt';
import { expireIn } from '~/framework/api/key/expireIn';
import { expireNow } from '~/framework/api/key/expireNow';

export function key(keyName: string = null): FrameworkKeyApi {
  const self = this;

  return {
    activity: activity.call(self, keyName),
    get: get.call(self, keyName),
    insert: insert.call(self, keyName),
    replace: replace.call(self, keyName),
    update: update.call(self, keyName),
    repsert: repsert.call(self, keyName),
    upsert: upsert.call(self, keyName),
    delete: delete_.call(self, keyName),
    forget: forget.call(self, keyName),
    drop: drop.call(self, keyName),
    restore: restore.call(self, keyName),
    expireAt: expireAt.call(self, keyName),
    expireIn: expireIn.call(self, keyName),
    expireNow: expireNow.call(self, keyName),
  };
}
