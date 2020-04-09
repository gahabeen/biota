import { query as q } from "faunadb";
import { DBFactoryDocumentApi } from "~/../types/factory/factory.classes";
import { DB } from "~/db";
import * as call from "~/factory/api/call";

export const document: DBFactoryDocumentApi = {
  login(this: DB, name, id, password) {
    return q.Login(q.Ref(q.Collection(name), id), {
      password,
    });
  },
  credentials(this: DB, name, id, credentials) {
    return call.update.credentials.call(this, name, id, credentials);
  },
  changePassword(this: DB, name, id, password) {
    return call.update.credentials.call(this, name, id, { password });
  },
  get(this: DB, collection, id) {
    return call.get.document.call(this, collection, id);
  },
  insert(this: DB, collection, data, id) {
    return call.insert.document.call(this, collection, data, id);
  },
  update(this: DB, collection, id, data) {
    return call.update.document.call(this, collection, id, data);
  },
  replace(this: DB, collection, id, data) {
    return call.replace.document.call(this, collection, id, data);
  },
  upsert(this: DB, collection, id, data) {
    return call.upsert.document.call(this, collection, id, data);
  },
  repsert(this: DB, collection, id, data) {
    return call.repsert.document.call(this, collection, id, data);
  },
  delete(this: DB, collection, id) {
    return call.delete.document.call(this, collection, id);
  },
  forget(this: DB, collection, id) {
    return call.forget.document.call(this, collection, id);
  },
  expireIn(this: DB, collection, id, delayInMs) {
    return call.expire.documentIn.call(this, collection, id, delayInMs);
  },
  expireAt(this: DB, collection, id, at) {
    return call.expire.documentAt.call(this, collection, id, at);
  },
  expireNow(this: DB, collection, id) {
    return call.expire.documentNow.call(this, collection, id);
  },
};
