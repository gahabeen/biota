import { query as q } from "faunadb";
import { DBFactoryDocumentApi } from "~/../types/factory/factory.classes";
import * as udf from "~/factory/api/udf";
import { Reference } from "../ql";

export const document: DBFactoryDocumentApi = {
  login(name, id, password) {
    return q.Login(q.Ref(q.Collection(name), id), {
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
  insert(collection, data, id) {
    return udf.insert.document(collection, data, id);
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
    return udf.delete.document(collection, id);
  },
  forget(collection, id) {
    return udf.forget.document(collection, id);
  },
  expireIn(collection, id, delayInMs) {
    return udf.expire.documentIn(collection, id, delayInMs);
  },
  expireAt(collection, id, at) {
    return udf.expire.documentAt(collection, id, at);
  },
  expireNow(collection, id) {
    return udf.expire.documentNow(collection, id);
  },
};
