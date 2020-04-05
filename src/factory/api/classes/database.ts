import { DBFactoryDatabaseApi } from "~/../types/factory/factory.classes";
import * as udf from "~/factory/api/udf";

export const database: DBFactoryDatabaseApi = {
  all() {
    return udf.get.databases();
  },
  get(name) {
    return udf.get.database(name);
  },
  insert(name, options) {
    return udf.insert.database(name, options);
  },
  update(name, options) {
    return udf.update.database(name, options);
  },
  replace(name, options) {
    return udf.replace.database(name, options);
  },
  upsert(name, options) {
    return udf.upsert.database(name, options);
  },
  repsert(name, options) {
    return udf.repsert.database(name, options);
  },
  delete(name) {
    return udf.delete.database(name);
  },
  forget(name) {
    return udf.forget.database(name);
  },
};
