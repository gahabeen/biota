import { DBFactoryCollection } from "~/../types/db";
import * as udf from "~/factory/api/udf";

export function udfunction(name: string = undefined): DBFactoryCollection {
  if (!name) {
    throw new Error(`biota.udfunction(name) - valid name is required`);
  }

  return {
    get(id, options = {}) {
      return udf.get.udfunction(name, id, options);
    },
    insert(data, { id, password, credentials } = {}) {
      return udf.insert.udfunction(name, data, { id, password, credentials });
    },
    update(id, data) {
      return udf.update.udfunction(name, id, data);
    },
    replace(id, data) {
      return udf.replace.udfunction(name, id, data);
    },
    upsert(id, data) {
      return udf.upsert.udfunction(name, id, data);
    },
    repsert(id, data) {
      return udf.repsert.udfunction(name, id, data);
    },
    delete(id) {
      return udf.delete_.udfunction(name, id);
    },
    forget(id) {
      return udf.forget.udfunction(name, id);
    },
  };
}
