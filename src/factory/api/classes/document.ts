import { query as q } from "faunadb";
import { DBFactoryDocumentApi } from "~/../types/factory/factory.collection";
import * as udf from "~/factory/api/udf";
import { Reference } from "../ql";

export const document: DBFactoryDocumentApi = {
  login(name, id, password) {
    return q.Login(Reference({ collection: name, id }), {
      password,
    });
  },
  credentials(name, id, credentials) {
    return udf.update.credentials(name, id, credentials);
  },
  changePassword(name, id, password) {
    return udf.update.credentials(name, id, { password });
  },
  get(collection, id) {
    return udf.get.document(collection, id);
  },
  insert(collection, options) {
    return udf.insert.document(collection, options);
  },
  update(collection, id, options) {
    return udf.update.document(collection, id, options);
  },
  replace(collection, id, options) {
    return udf.replace.document(collection, id, options);
  },
  upsert(collection, id, options) {
    return udf.upsert.document(collection, id, options);
  },
  repsert(collection, id, options) {
    return udf.repsert.document(collection, id, options);
  },
  delete(collection, id) {
    return udf.delete.document(collection, id);
  },
  forget(collection, id) {
    return udf.forget.document(collection, id);
  },
};
