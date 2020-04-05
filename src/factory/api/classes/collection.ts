import * as udf from "~/factory/api/udf";
import { DBFactoryCollectionApi } from "~/../types/factory/factory.classes";

export const collection: DBFactoryCollectionApi = {
  all() {
    return udf.get.collections();
  },
  get(name) {
    return udf.get.collection(name);
  },
  insert(name, options) {
    return udf.insert.collection(name, options);
  },
  update(name, options) {
    return udf.update.collection(name, options);
  },
  replace(name, options) {
    return udf.replace.collection(name, options);
  },
  upsert(name, options) {
    return udf.upsert.collection(name, options);
  },
  repsert(name, options) {
    return udf.repsert.collection(name, options);
  },
  delete(name) {
    return udf.delete.collection(name);
  },
  forget(name) {
    return udf.forget.collection(name);
  },
};
