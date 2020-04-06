import * as udf from "~/factory/api/udf";
import { DBFactoryCollectionApi } from "~/../types/factory/factory.classes";

export const collection: DBFactoryCollectionApi = {
  all() {
    return udf.get.collections();
  },
  clean(name) {
    return udf.clean.documents(name);
  },
  cleanAll() {
    return udf.clean.collections();
  },
  get(name) {
    return udf.get.collection(name);
  },
  insert(name, data) {
    return udf.insert.collection(name, data);
  },
  update(name, data) {
    return udf.update.collection(name, data);
  },
  replace(name, data) {
    return udf.replace.collection(name, data);
  },
  upsert(name, data) {
    return udf.upsert.collection(name, data);
  },
  repsert(name, data) {
    return udf.repsert.collection(name, data);
  },
  delete(name) {
    return udf.delete.collection(name);
  },
  forget(name) {
    return udf.forget.collection(name);
  },
};
