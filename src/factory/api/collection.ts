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
    login: function collectionLogin(id, password) {
      return q.Login(Reference({ collection: name, id }), {
        password
      });
    },
    logout: function collectionLogout(everywhere) {
      return q.Logout(everywhere);
    },
    changePassword: function collectionChangePassword(password) {
      return q.Call("biota.ChangePassword", [
        q.If(q.HasIdentity(), q.Identity(), null),
        q.Identity(),
        password
      ]);
    },
    get: function collectionGet(id) {
      return q.Get(q.Ref(q.Collection(name), id));
    },
    import: function collectionImport(data, options = {}) {
      let { id, password } = options;
      return q.Call("biota.Import", [
        q.If(q.HasIdentity(), q.Identity(), null),
        Reference({ collection: name, id }),
        { data, credentials: { password } }
      ]);
    },
    create: function collectionCreate(data, { id, password } = {}) {
      return q.Call("biota.Create", [
        q.If(q.HasIdentity(), q.Identity(), null),
        Reference({ collection: name, id }),
        { data, credentials: { password } }
      ]);
    },
    update: function collectionUpdate(data, id) {
      return q.Call("biota.Update", [
        q.If(q.HasIdentity(), q.Identity(), null),
        Reference({ collection: name, id }),
        { data }
      ]);
    },
    replace: function collectionReplace(data, id) {
      return q.Call("biota.Replace", [
        q.If(q.HasIdentity(), q.Identity(), null),
        Reference({ collection: name, id }),
        { data }
      ]);
    },
    upsert: function collectionUpsert(data, id) {
      return q.If(
        q.Exists(Reference({ collection: name, id })),
        collection(name).update(data, id),
        collection(name).create(data, { id })
      );
    },
    repsert: function collectionRepsert(data, id) {
      return q.If(
        q.Exists(Reference({ collection: name, id })),
        collection(name).replace(data, id),
        collection(name).create(data, { id })
      );
    },
    delete: function collectionDelete(id) {
      return q.Call("biota.Delete", [
        q.If(q.HasIdentity(), q.Identity(), null),
        Reference({ collection: name, id })
      ]);
    },
    forget: function collectionForget(id) {
      return q.Call("biota.Forget", [
        q.If(q.HasIdentity(), q.Identity(), null),
        Reference({ collection: name, id })
      ]);
    }
  };
}
