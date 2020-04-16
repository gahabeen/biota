import { FrameworkCollectionApi } from '~/../types/framework/framework.collection';
import { activity } from '~/framework/api/collection/activity';
import { delete_ } from '~/framework/api/collection/delete';
import { drop } from '~/framework/api/collection/drop';
import { forget } from '~/framework/api/collection/forget';
import { get } from '~/framework/api/collection/get';
import { insert } from '~/framework/api/collection/insert';
import { replace } from '~/framework/api/collection/replace';
import { repsert } from '~/framework/api/collection/repsert';
import { restore } from '~/framework/api/collection/restore';
import { update } from '~/framework/api/collection/update';
import { upsert } from '~/framework/api/collection/upsert';
import { findAll } from '~/framework/api/collection/findAll';
import { find } from '~/framework/api/collection/find';
import { expireAt } from '~/framework/api/collection/expireAt';
import { expireIn } from '~/framework/api/collection/expireIn';
import { expireNow } from '~/framework/api/collection/expireNow';
//
import { scaffold } from '~/framework/api/collection/scaffold';
import { field } from '~/framework/api/collection/field';
import { index } from '~/framework/api/collection/index';
import { compute } from '~/framework/api/collection/compute';
import { insertBatch } from '~/framework/api/collection/insertBatch';
import { paginate } from '~/framework/api/collection/paginate';
import { paginateAll } from '~/framework/api/collection/paginateAll';

export function collection(collectionName: string): FrameworkCollectionApi {
  const self = this;

  if (!collectionName) {
    throw new Error('biota.collection() - no valid collection name');
  }

  return {
    scaffold: scaffold.call(self, collectionName),
    field: field.call(self, collectionName),
    index: index.call(self, collectionName),
    compute: compute.call(self, collectionName),
    insertBatch: insertBatch.call(self, collectionName),
    paginate: paginate.call(self, collectionName),
    paginateAll: paginateAll.call(self, collectionName),

    find: find.call(self, collectionName),
    expireAt: expireAt.call(self, collectionName),
    expireIn: expireIn.call(self, collectionName),
    expireNow: expireNow.call(self, collectionName),
    findAll: findAll.call(self, collectionName),
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
  };
}
