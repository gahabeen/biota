// types
import { DBFrameworkCollection, FaunaCollectionOptions } from "~/../types/db";
import { Collection } from "~/factory/classes/collection";

import { scaffold } from "~/framework/api/collection/scaffold"
import { field } from "~/framework/api/collection/field";
import { index } from "~/framework/api/collection/index";
import { compute } from "~/framework/api/collection/compute";
import { find } from "~/framework/api/collection/find";
import { paginate } from "~/framework/api/collection/paginate";
import { get } from "~/framework/api/collection/get";
import { insert } from "~/framework/api/collection/insert";
import { insertBatch } from "~/framework/api/collection/insertBatch";
import { replace } from "~/framework/api/collection/replace";
import { update } from "~/framework/api/collection/update";
import { repsert } from "~/framework/api/collection/repsert";
import { upsert } from "~/framework/api/collection/upsert";
import { deleteFn } from "~/framework/api/collection/delete";
import { forget } from "~/framework/api/collection/forget";

export function collection(collectionNameOrOptions: string | FaunaCollectionOptions): DBFrameworkCollection {
  let self = this;

  let collectionDefinition: FaunaCollectionOptions = Collection({});

  if (typeof collectionNameOrOptions === "string") {
    collectionDefinition.name = collectionNameOrOptions;
  } else if (typeof collectionNameOrOptions === "object") {
    Object.assign(collectionDefinition, collectionNameOrOptions);
  }

  if (!collectionDefinition.name) {
    throw new Error("biota.collection() - no valid collection name");
  }

  let methods: DBFrameworkCollection = {
    scaffold: scaffold.call(self, collectionDefinition),
    field: field.call(self, collectionDefinition),
    index: index.call(self, collectionDefinition),
    compute: compute.call(self, collectionDefinition),
    find: find.call(self, collectionDefinition),
    paginate: paginate.call(self, collectionDefinition),
    get: get.call(self, collectionDefinition),
    insert: insert.call(self, collectionDefinition),
    insertBatch: insertBatch.call(self, collectionDefinition),
    replace: replace.call(self, collectionDefinition),
    update: update.call(self, collectionDefinition),
    repsert: repsert.call(self, collectionDefinition),
    upsert: upsert.call(self, collectionDefinition),
    delete: deleteFn.call(self, collectionDefinition),
    forget: forget.call(self, collectionDefinition),
    async changes() {}
  };

  return methods;
}
