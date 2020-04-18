import { FrameworkUDFunctionApi } from '~/types/framework/framework.udfunction';
import { activity } from '~/framework/api/udfunction/activity';
import { delete_ } from '~/framework/api/udfunction/delete';
import { forget } from '~/framework/api/udfunction/forget';
import { get } from '~/framework/api/udfunction/get';
import { insert } from '~/framework/api/udfunction/insert';
import { replace } from '~/framework/api/udfunction/replace';
import { repsert } from '~/framework/api/udfunction/repsert';
import { update } from '~/framework/api/udfunction/update';
import { upsert } from '~/framework/api/udfunction/upsert';
import { drop } from '~/framework/api/udfunction/drop';
import { restore } from '~/framework/api/udfunction/restore';
import { expireAt } from '~/framework/api/udfunction/expireAt';
import { expireIn } from '~/framework/api/udfunction/expireIn';
import { expireNow } from '~/framework/api/udfunction/expireNow';

export function udfunction(udfunctionName: string = null): FrameworkUDFunctionApi {
  const self = this;

  return {
    activity: activity.call(self, udfunctionName),
    get: get.call(self, udfunctionName),
    insert: insert.call(self, udfunctionName),
    replace: replace.call(self, udfunctionName),
    update: update.call(self, udfunctionName),
    repsert: repsert.call(self, udfunctionName),
    upsert: upsert.call(self, udfunctionName),
    delete: delete_.call(self, udfunctionName),
    forget: forget.call(self, udfunctionName),
    drop: drop.call(self, udfunctionName),
    restore: restore.call(self, udfunctionName),
    expireAt: expireAt.call(self, udfunctionName),
    expireIn: expireIn.call(self, udfunctionName),
    expireNow: expireNow.call(self, udfunctionName),
  };
}
