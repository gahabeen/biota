import * as call from "~/factory/api/call";
import { DBFactoryCollectionApi } from "~/../types/factory/factory.classes";
import { DB } from "~/db";

export const collection: DBFactoryCollectionApi = {
  all(this: DB) {
    return call.get.collections.call(this);
  },
  clean(this: DB, name) {
    return call.clean.documents.call(this, name);
  },
  cleanAll(this: DB) {
    return call.clean.collections.call(this);
  },
  get(this: DB, name) {
    return call.get.collection.call(this, name);
  },
  insert(this: DB, name, data) {
    return call.insert.collection.call(this, name, data);
  },
  update(this: DB, name, data) {
    return call.update.collection.call(this, name, data);
  },
  replace(this: DB, name, data) {
    return call.replace.collection.call(this, name, data);
  },
  upsert(this: DB, name, data) {
    return call.upsert.collection.call(this, name, data);
  },
  repsert(this: DB, name, data) {
    return call.repsert.collection.call(this, name, data);
  },
  delete(this: DB, name) {
    return call.delete.collection.call(this, name);
  },
  forget(this: DB, name) {
    return call.forget.collection.call(this, name);
  },
};
