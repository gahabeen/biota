import { FrameworkDocumentApi } from '~/../types/framework/framework.document';
import { activity } from '~/framework/api/document/activity';
import { delete_ } from '~/framework/api/document/delete';
import { forget } from '~/framework/api/document/forget';
import { get } from '~/framework/api/document/get';
import { insert } from '~/framework/api/document/insert';
import { replace } from '~/framework/api/document/replace';
import { repsert } from '~/framework/api/document/repsert';
import { update } from '~/framework/api/document/update';
import { upsert } from '~/framework/api/document/upsert';
import { drop } from '~/framework/api/document/drop';
import { restore } from '~/framework/api/document/restore';
import { expireAt } from '~/framework/api/document/expireAt';
import { expireIn } from '~/framework/api/document/expireIn';
import { expireNow } from '~/framework/api/document/expireNow';
import { membership } from '~/framework/api/document/membership';

export function document(collectionName: string): FrameworkDocumentApi {
  const self = this;

  if (!collectionName) {
    throw new Error('biota.collection() - no valid collection name');
  }

  return {
    activity: activity.call(self, collectionName),
    get: get.call(self, collectionName),
    insert: insert.call(self, collectionName),
    replace: replace.call(self, collectionName),
    update: update.call(self, collectionName),
    repsert: repsert.call(self, collectionName),
    upsert: upsert.call(self, collectionName),
    delete: delete_.call(self, collectionName),
    forget: forget.call(self, collectionName),
    drop: drop.call(self, collectionName),
    restore: restore.call(self, collectionName),
    expireAt: expireAt.call(self, collectionName),
    expireIn: expireIn.call(self, collectionName),
    expireNow: expireNow.call(self, collectionName),
    membership: membership.call(self, collectionName),
  };
}
