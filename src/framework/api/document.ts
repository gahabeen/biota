import { activity } from '~/framework/api/document/activity';
import { delete_ } from '~/framework/api/document/delete';
import { drop } from '~/framework/api/document/drop';
import { expireAt } from '~/framework/api/document/expireAt';
import { expireIn } from '~/framework/api/document/expireIn';
import { expireNow } from '~/framework/api/document/expireNow';
import { forget } from '~/framework/api/document/forget';
import { get } from '~/framework/api/document/get';
import { history } from '~/framework/api/document/history';
import { insert } from '~/framework/api/document/insert';
import { membership } from '~/framework/api/document/membership';
import { remember } from '~/framework/api/document/remember';
import { replace } from '~/framework/api/document/replace';
import { repsert } from '~/framework/api/document/repsert';
import { restore } from '~/framework/api/document/restore';
import { update } from '~/framework/api/document/update';
import { upsert } from '~/framework/api/document/upsert';
import { inputStringLiteral } from '~/helpers/literals';
import { FrameworkDocument } from '~/types/framework/framework.document';

export const document: FrameworkDocument = function (...args) {
  const [collectionName, id] = inputStringLiteral(args);

  return {
    activity: activity.call(this, collectionName, id),
    history: history.call(this, collectionName, id),
    get: get.call(this, collectionName, id),
    insert: insert.call(this, collectionName, id),
    replace: replace.call(this, collectionName, id),
    update: update.call(this, collectionName, id),
    repsert: repsert.call(this, collectionName, id),
    upsert: upsert.call(this, collectionName, id),
    delete: delete_.call(this, collectionName, id),
    forget: forget.call(this, collectionName, id),
    drop: drop.call(this, collectionName, id),
    restore: restore.call(this, collectionName, id),
    remember: remember.call(this, collectionName, id),
    expireAt: expireAt.call(this, collectionName, id),
    expireIn: expireIn.call(this, collectionName, id),
    expireNow: expireNow.call(this, collectionName, id),
    membership: membership.call(this, collectionName, id),
  };
};
