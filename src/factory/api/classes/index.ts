import { DBFactoryIndexApi } from "~/../types/factory/factory.collection";
import * as udf from "~/factory/api/udf";

export const index: DBFactoryIndexApi = {
  all() {
    return udf.get.indexes();
  },
  get(name) {
    return udf.get.index(name);
  },
  insert(name, options) {
    return udf.insert.index(name, options);
  },
  update(name, options) {
    return udf.update.index(name, options);
  },
  replace(name, options) {
    return udf.replace.index(name, options);
  },
  upsert(name, options) {
    return udf.upsert.index(name, options);
  },
  repsert(name, options) {
    return udf.repsert.index(name, options);
  },
  delete(name) {
    return udf.delete.index(name);
  },
  forget(name) {
    return udf.forget.index(name);
  },
};
