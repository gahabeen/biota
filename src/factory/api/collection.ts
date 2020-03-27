// types
import { DBFactoryCollection } from "~/../types/db";
// external
import { query as q } from "faunadb";
// biota
import { Reference } from "~/factory/api/ql";

export * from "../collection/wrapper";

export function collection(name: string = undefined): DBFactoryCollection {
  if (!name) {
    throw new Error(`biota.collection(name) - valid name is required`);
  }

  return {
    list: function collectionList() {
      return q.Paginate(q.Documents(q.Collection(name)));
    },
    login: function collectionLogin(password, id) {
      return q.Login(Reference(id ? { collection: name, id } : q.Identity()), {
        password
      });
    },
    logout: function collectionLogout(everywhere) {
      return q.Logout(everywhere);
    },
    changePassword: function collectionChangePassword(password) {
      return q.Call("biota.ChangePassword", [
        q.Identity(),
        q.Identity(),
        password
      ]);
    },
    get: function collectionGet(id) {
      return q.Get(q.Ref(q.Collection(name), id));
    },
    create: function collectionCreate(data, { id, password } = {}) {
      return q.Call("biota.Create", [
        q.Identity(),
        Reference({ collection: name, id }),
        { data, credentials: { password } }
      ]);
    },
    update: function collectionUpdate(id, data) {
      return q.Call("biota.Update", [
        q.Identity(),
        Reference({ collection: name, id }),
        { data }
      ]);
    },
    upsert: function collectionUpsert(id, data) {
      return q.If(
        q.Exists(Reference({ collection: name, id })),
        collection(name).update(id, data),
        collection(name).create(data, { id })
      );
    },
    delete: function collectionDelete(id) {
      return q.Update(Reference({ collection: name, id }), {});
    },
    forget: function collectionForget(id) {
      return q.Delete(Reference({ collection: name, id }));
    }
  };
}
