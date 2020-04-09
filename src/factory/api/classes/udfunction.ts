import { DBFactoryCallunctionApi } from "~/../types/factory/factory.classes";
import * as call from "~/factory/api/call";
import { DB } from "~/db";

export const udfunction: DBFactoryCallunctionApi = {
  all(this: DB) {
    return call.get.udfunctions.call(this);
  },
  cleanAll(this: DB) {
    return call.clean.udfunctions.call(this);
  },
  clean(this: DB, name) {
    return call.clean.udfunction.call(this, name);
  },
  get(this: DB, name) {
    return call.get.udfunction.call(this, name);
  },
  insert(this: DB, name, options) {
    return call.insert.udfunction.call(this, name, options);
  },
  update(this: DB, name, options) {
    return call.update.udfunction.call(this, name, options);
  },
  replace(this: DB, name, options) {
    return call.replace.udfunction.call(this, name, options);
  },
  upsert(this: DB, name, options) {
    return call.upsert.udfunction.call(this, name, options);
  },
  repsert(this: DB, name, options) {
    return call.repsert.udfunction.call(this, name, options);
  },
  delete(this: DB, name) {
    return call.delete.udfunction.call(this, name);
  },
  forget(this: DB, name) {
    return call.forget.udfunction.call(this, name);
  },
};
