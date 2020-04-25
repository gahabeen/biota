import { Biota } from '~/biota';
import { activity } from '~/framework/api/collection/activity';
import { compute } from '~/framework/api/collection/compute';
import { delete_ } from '~/framework/api/collection/delete';
import { drop } from '~/framework/api/collection/drop';
import { expireAt } from '~/framework/api/collection/expireAt';
import { expireIn } from '~/framework/api/collection/expireIn';
import { expireNow } from '~/framework/api/collection/expireNow';
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
import { restore } from '~/framework/api/collection/restore';
import { scaffold } from '~/framework/api/collection/scaffold';
import { update } from '~/framework/api/collection/update';
import { upsert } from '~/framework/api/collection/upsert';
import { inputStringLiteral } from '~/helpers/literals';
import { FrameworkCollection } from '~/types/framework/framework.collection';

export const collection: FrameworkCollection = function (this: Biota, ...args) {
  const [collectionName] = inputStringLiteral(args);

  return {
    scaffold: scaffold.call(this, collectionName),
    field: field.call(this, collectionName),
    index: index.call(this, collectionName),
    compute: compute.call(this, collectionName),
    insertBatch: insertBatch.call(this, collectionName),
    paginate: paginate.call(this, collectionName),
    paginateAll: paginateAll.call(this, collectionName),

    find: find.call(this, collectionName),
    expireAt: expireAt.call(this, collectionName),
    expireIn: expireIn.call(this, collectionName),
    expireNow: expireNow.call(this, collectionName),
    findAll: findAll.call(this, collectionName),
    activity: activity.call(this, collectionName),
    get: get.call(this, collectionName),
    insert: insert.call(this, collectionName),
    replace: replace.call(this, collectionName),
    update: update.call(this, collectionName),
    repsert: repsert.call(this, collectionName),
    upsert: upsert.call(this, collectionName),
    delete: delete_.call(this, collectionName),
    forget: forget.call(this, collectionName),
    drop: drop.call(this, collectionName),
    restore: restore.call(this, collectionName),
  };
};
