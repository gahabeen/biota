import { DBFactoryCollection } from "~/../types/db";
import { query as q } from "faunadb";
import { Reference, Identity } from "~/factory/api/ql";
import * as udf from "~/factory/api/udf";

export function collection(name: string = undefined): DBFactoryCollection {
  if (!name) {
    throw new Error(`biota.collection(name) - valid name is required`);
  }

  return {
    login(id, password) {
      return q.Login(Reference({ collection: name, id }), {
        password,
      });
    },
    changePassword(password, id = q.Select("id", q.Identity(), null)) {
      return udf.update.documentCredentials(name, id, { password });
    },
    get(id, options = {}) {
      return udf.get.document(name, id, options);
    },
    insert(data, { id, password, credentials } = {}) {
      return udf.insert.document(name, data, { id, password, credentials });
    },
    update(id, data) {
      return udf.update.document(name, id, data);
    },
    replace(id, data) {
      return udf.replace.document(name, id, data);
    },
    upsert(id, data) {
      return udf.upsert.document(name, id, data);
    },
    repsert(id, data) {
      return udf.repsert.document(name, id, data);
    },
    delete(id) {
      return udf.delete_.document(name, id);
    },
    forget(id) {
      return udf.forget.document(name, id);
    },
  };
}
