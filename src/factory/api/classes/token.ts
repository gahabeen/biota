import { DBFactoryTokenApi } from "~/../types/factory/factory.collection";
import * as udf from "~/factory/api/udf";

export const token: DBFactoryTokenApi = {
  all() {
    return udf.get.tokens();
  },
  get(id) {
    return udf.get.token(id);
  },
  insert(ref, options) {
    return udf.insert.token(ref, options);
  },
  update(id, options) {
    return udf.update.token(id, options);
  },
  replace(id, options) {
    return udf.replace.token(id, options);
  },
  upsert(id, options) {
    return udf.upsert.token(id, options);
  },
  repsert(id, options) {
    return udf.repsert.token(id, options);
  },
  delete(id) {
    return udf.delete.token(id);
  },
  forget(id) {
    return udf.forget.token(id);
  },
};
