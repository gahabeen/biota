import { activity } from '~/framework/api/database/activity';
import { delete_ } from '~/framework/api/database/delete';
import { drop } from '~/framework/api/database/drop';
import { expireAt } from '~/framework/api/database/expireAt';
import { expireIn } from '~/framework/api/database/expireIn';
import { expireNow } from '~/framework/api/database/expireNow';
import { forget } from '~/framework/api/database/forget';
import { get } from '~/framework/api/database/get';
import { insert } from '~/framework/api/database/insert';
import { replace } from '~/framework/api/database/replace';
import { repsert } from '~/framework/api/database/repsert';
import { restore } from '~/framework/api/database/restore';
import { update } from '~/framework/api/database/update';
import { upsert } from '~/framework/api/database/upsert';
import { inputStringLiteral } from '~/helpers/literals';
import { FrameworkDatabase } from '~/types/framework/framework.database';

export const database: FrameworkDatabase = function (...args) {
  const [databaseName] = inputStringLiteral(args);

  return {
    activity: activity.call(self, databaseName),
    get: get.call(self, databaseName),
    insert: insert.call(self, databaseName),
    replace: replace.call(self, databaseName),
    update: update.call(self, databaseName),
    repsert: repsert.call(self, databaseName),
    upsert: upsert.call(self, databaseName),
    delete: delete_.call(self, databaseName),
    forget: forget.call(self, databaseName),
    drop: drop.call(self, databaseName),
    restore: restore.call(self, databaseName),
    expireAt: expireAt.call(self, databaseName),
    expireIn: expireIn.call(self, databaseName),
    expireNow: expireNow.call(self, databaseName),
  };
};
