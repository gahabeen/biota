import { DBFactoryKeyApi } from "~/../types/factory/factory.classes";
import * as udf from "~/factory/api/udf";

export const key: DBFactoryKeyApi = {
  all() {
    return udf.get.keys();
  },
  cleanAll() {
    return udf.clean.keys();
  },
  get(id) {
    return udf.get.key(id);
  },
  insert(name, options) {
    return udf.insert.key(name, options);
  },
  update(id, options) {
    return udf.update.key(id, options);
  },
  replace(id, options) {
    return udf.replace.key(id, options);
  },
  upsert(id, options) {
    return udf.upsert.key(id, options);
  },
  repsert(id, options) {
    return udf.repsert.key(id, options);
  },
  delete(id) {
    return udf.delete.key(id);
  },
  forget(id) {
    return udf.forget.key(id);
  },
};
