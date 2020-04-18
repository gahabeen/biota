import { FrameworkDocument } from '~/types/framework/framework.document';
import { activity } from '~/framework/api/document/activity';
import { delete_ } from '~/framework/api/document/delete';
import { drop } from '~/framework/api/document/drop';
import { expireAt } from '~/framework/api/document/expireAt';
import { expireIn } from '~/framework/api/document/expireIn';
import { expireNow } from '~/framework/api/document/expireNow';
import { forget } from '~/framework/api/document/forget';
import { get } from '~/framework/api/document/get';
import { insert } from '~/framework/api/document/insert';
import { membership } from '~/framework/api/document/membership';
import { replace } from '~/framework/api/document/replace';
import { repsert } from '~/framework/api/document/repsert';
import { restore } from '~/framework/api/document/restore';
import { remember } from '~/framework/api/document/remember';
import { update } from '~/framework/api/document/update';
import { upsert } from '~/framework/api/document/upsert';
import { history } from '~/framework/api/document/history';

export const document: FrameworkDocument = function (collectionName = null, id = null) {
  const self = this;

  return {
    activity: activity.call(self, collectionName, id),
    history: history.call(self, collectionName, id),
    get: get.call(self, collectionName, id),
    insert: insert.call(self, collectionName, id),
    replace: replace.call(self, collectionName, id),
    update: update.call(self, collectionName, id),
    repsert: repsert.call(self, collectionName, id),
    upsert: upsert.call(self, collectionName, id),
    delete: delete_.call(self, collectionName, id),
    forget: forget.call(self, collectionName, id),
    drop: drop.call(self, collectionName, id),
    restore: restore.call(self, collectionName, id),
    remember: remember.call(self, collectionName, id),
    expireAt: expireAt.call(self, collectionName, id),
    expireIn: expireIn.call(self, collectionName, id),
    expireNow: expireNow.call(self, collectionName, id),
    membership: membership.call(self, collectionName, id),
  };
};
