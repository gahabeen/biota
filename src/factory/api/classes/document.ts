import { DBFactoryCollection, FaunaRef } from "~/../types/db";
import { query as q } from "faunadb";
import { Reference, Identity } from "~/factory/api/ql";
import * as udf from "~/factory/api/udf";

export const document = {
  get(collection, id, options = {}) {
    return udf.get.document(collection, id, options);
  },
  insert(collection, data, { id, password, credentials } = {}) {
    return udf.insert.document(collection, data, { id, password, credentials });
  },
  update(collection, id, data) {
    return udf.update.document(collection, id, data);
  },
  replace(collection, id, data) {
    return udf.replace.document(collection, id, data);
  },
  upsert(collection, id, data) {
    return udf.upsert.document(collection, id, data);
  },
  repsert(collection, id, data) {
    return udf.repsert.document(collection, id, data);
  },
  delete(collection, id) {
    return udf.delete_.document(collection, id);
  },
  forget(collection, id) {
    return udf.forget.document(collection, id);
  },
};
