import { BiotaFrameworkCollectionApi } from '~/../types/framework/framework.collection';
import { activity } from '~/framework/api/collection/activity';
import { compute } from '~/framework/api/collection/compute';
import { delete_ } from '~/framework/api/collection/delete';
import { field } from '~/framework/api/collection/field';
import { find } from '~/framework/api/collection/find';
import { findAll } from '~/framework/api/collection/findAll';
import { forget } from '~/framework/api/collection/forget';
import { get } from '~/framework/api/collection/get';
import { index } from '~/framework/api/collection/index';
import { insert } from '~/framework/api/collection/insert';
import { insertBatch } from '~/framework/api/collection/insertBatch';
import { paginate } from '~/framework/api/collection/paginate';
import { paginateAll } from '~/framework/api/collection/paginateAll';
import { replace } from '~/framework/api/collection/replace';
import { repsert } from '~/framework/api/collection/repsert';
import { scaffold } from '~/framework/api/collection/scaffold';
import { update } from '~/framework/api/collection/update';
import { upsert } from '~/framework/api/collection/upsert';
import { drop } from '~/framework/api/collection/drop';

export function collection(collectionName: string): BiotaFrameworkCollectionApi {
  const self = this;

  if (!collectionName) {
    throw new Error('biota.collection() - no valid collection name');
  }

  return {
    drop: drop.call(self, collectionName),
    scaffold: scaffold.call(self, collectionName),
    activity: activity.call(self, collectionName),
    field: field.call(self, collectionName),
    index: index.call(self, collectionName),
    compute: compute.call(self, collectionName),
    find: find.call(self, collectionName),
    findAll: findAll.call(self, collectionName),
    paginate: paginate.call(self, collectionName),
    paginateAll: paginateAll.call(self, collectionName),
    get: get.call(self, collectionName),
    insert: insert.call(self, collectionName),
    insertBatch: insertBatch.call(self, collectionName),
    replace: replace.call(self, collectionName),
    update: update.call(self, collectionName),
    repsert: repsert.call(self, collectionName),
    upsert: upsert.call(self, collectionName),
    delete: delete_.call(self, collectionName),
    forget: forget.call(self, collectionName),
    async changes() {},
  };
}
