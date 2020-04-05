import { DBFactoryUDFunctionApi } from "~/../types/factory/factory.classes";
import * as udf from "~/factory/api/udf";

export const udfunction: DBFactoryUDFunctionApi = {
  all() {
    return udf.get.udfunctions();
  },
  get(name) {
    return udf.get.udfunction(name);
  },
  insert(name, options) {
    return udf.insert.udfunction(name, options);
  },
  update(name, options) {
    return udf.update.udfunction(name, options);
  },
  replace(name, options) {
    return udf.replace.udfunction(name, options);
  },
  upsert(name, options) {
    return udf.upsert.udfunction(name, options);
  },
  repsert(name, options) {
    return udf.repsert.udfunction(name, options);
  },
  delete(name) {
    return udf.delete.udfunction(name);
  },
  forget(name) {
    return udf.forget.udfunction(name);
  },
};
