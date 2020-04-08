import { DBFactoryTokenApi } from "~/../types/factory/factory.classes";
import * as call from "~/factory/api/call";
import { DB } from "~/db";

export const token: DBFactoryTokenApi = {
  all(this: DB) {
    return call.get.tokens.call(this);
  },
  cleanAll(this: DB) {
    return call.clean.tokens.call(this);
  },
  get(this: DB, id) {
    return call.get.token.call(this, id);
  },
  insert(this: DB, ref, options) {
    return call.insert.token.call(this, ref, options);
  },
  update(this: DB, id, options) {
    return call.update.token.call(this, id, options);
  },
  replace(this: DB, id, options) {
    return call.replace.token.call(this, id, options);
  },
  upsert(this: DB, id, options) {
    return call.upsert.token.call(this, id, options);
  },
  repsert(this: DB, id, options) {
    return call.repsert.token.call(this, id, options);
  },
  delete(this: DB, id) {
    return call.delete.token.call(this, id);
  },
  forget(this: DB, id) {
    return call.forget.token.call(this, id);
  },
};
