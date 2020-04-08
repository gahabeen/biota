import { DBFactoryDatabaseApi } from "~/../types/factory/factory.classes";
import * as call from "~/factory/api/call";
import { DB } from "~/db";

export const database: DBFactoryDatabaseApi = {
  all(this: DB) {
    return call.get.databases.call(this);
  },
  cleanAll(this: DB) {
    return call.clean.databases.call(this);
  },
  clean(this: DB, name) {
    return call.clean.database.call(this, name);
  },
  get(this: DB, name) {
    return call.get.database.call(this, name);
  },
  insert(this: DB, name, options) {
    return call.insert.database.call(this, name, options);
  },
  update(this: DB, name, options) {
    return call.update.database.call(this, name, options);
  },
  replace(this: DB, name, options) {
    return call.replace.database.call(this, name, options);
  },
  upsert(this: DB, name, options) {
    return call.upsert.database.call(this, name, options);
  },
  repsert(this: DB, name, options) {
    return call.repsert.database.call(this, name, options);
  },
  delete(this: DB, name) {
    return call.delete.database.call(this, name);
  },
  forget(this: DB, name) {
    return call.forget.database.call(this, name);
  },
};
