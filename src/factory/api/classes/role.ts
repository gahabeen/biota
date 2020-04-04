import { DBFactoryRoleApi } from "~/../types/factory/factory.collection";
import * as udf from "~/factory/api/udf";

export const role: DBFactoryRoleApi = {
  all() {
    return udf.get.roles();
  },
  get(name) {
    return udf.get.role(name);
  },
  insert(name, options) {
    return udf.insert.role(name, options);
  },
  update(name, options) {
    return udf.update.role(name, options);
  },
  replace(name, options) {
    return udf.replace.role(name, options);
  },
  upsert(name, options) {
    return udf.upsert.role(name, options);
  },
  repsert(name, options) {
    return udf.repsert.role(name, options);
  },
  delete(name) {
    return udf.delete.role(name);
  },
  forget(name) {
    return udf.forget.role(name);
  },
};
