import { activity } from '~/framework/api/udfunction/activity';
import { delete_ } from '~/framework/api/udfunction/delete';
import { drop } from '~/framework/api/udfunction/drop';
import { exists } from '~/framework/api/udfunction/exists';
import { expireAt } from '~/framework/api/udfunction/expireAt';
import { expireIn } from '~/framework/api/udfunction/expireIn';
import { expireNow } from '~/framework/api/udfunction/expireNow';
import { forget } from '~/framework/api/udfunction/forget';
import { get } from '~/framework/api/udfunction/get';
import { insert } from '~/framework/api/udfunction/insert';
import { replace } from '~/framework/api/udfunction/replace';
import { repsert } from '~/framework/api/udfunction/repsert';
import { restore } from '~/framework/api/udfunction/restore';
import { update } from '~/framework/api/udfunction/update';
import { upsert } from '~/framework/api/udfunction/upsert';
import { inputStringLiteral } from '~/helpers/literals';
import { FrameworkUDFunction } from '~/types/framework/framework.udfunction';

export const udfunction: FrameworkUDFunction = function (...args) {
  const [udfunctionName] = inputStringLiteral(args);
  return {
    activity: activity.call(this, udfunctionName),
    get: get.call(this, udfunctionName),
    insert: insert.call(this, udfunctionName),
    replace: replace.call(this, udfunctionName),
    update: update.call(this, udfunctionName),
    repsert: repsert.call(this, udfunctionName),
    upsert: upsert.call(this, udfunctionName),
    delete: delete_.call(this, udfunctionName),
    forget: forget.call(this, udfunctionName),
    drop: drop.call(this, udfunctionName),
    restore: restore.call(this, udfunctionName),
    expireAt: expireAt.call(this, udfunctionName),
    expireIn: expireIn.call(this, udfunctionName),
    expireNow: expireNow.call(this, udfunctionName),
    exists: exists.call(this, udfunctionName),
  };
};
