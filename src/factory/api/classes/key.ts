import { DBFactoryKeyApi } from "~/../types/factory/factory.classes";
import * as call from "~/factory/api/call";
import { DB } from "~/db";

export const key: DBFactoryKeyApi = {
  all(this: DB) {
    return call.get.keys.call(this);
  },
  cleanAll(this: DB) {
    return call.clean.keys.call(this);
  },
  get(this: DB, id) {
    return call.get.key.call(this, id);
  },
  insert(this: DB, name, options) {
    return call.insert.key.call(this, name, options);
  },
  update(this: DB, id, options) {
    return call.update.key.call(this, id, options);
  },
  replace(this: DB, id, options) {
    return call.replace.key.call(this, id, options);
  },
  upsert(this: DB, id, options) {
    return call.upsert.key.call(this, id, options);
  },
  repsert(this: DB, id, options) {
    return call.repsert.key.call(this, id, options);
  },
  delete(this: DB, id) {
    return call.delete.key.call(this, id);
  },
  forget(this: DB, id) {
    return call.forget.key.call(this, id);
  },
};
