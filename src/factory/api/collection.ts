// types
import { DBFactoryCollection } from "~/../types/db";
// external
import { query as q } from "faunadb";
// biota
import { Reference, Identity } from "~/factory/api/ql";

export function collection(name: string = undefined): DBFactoryCollection {
  if (!name) {
    throw new Error(`biota.collection(name) - valid name is required`);
  }

  return {
    /**
     * Specific methods
     */
    login(id, password) {
      return q.Login(Reference({ collection: name, id }), {
        password
      });
    },
    changePassword(password, id = q.Identity()) {
      return q.Call("biota.ChangePassword", [Identity(), id, password]);
    },
    /**
     * General methods
     */
    get(id) {
      return q.Get(q.Ref(q.Collection(name), id));
    },
    insert(data, { id, password, credentials } = {}) {
      return q.Call("biota.Insert", [
        Identity(),
        Reference({ collection: name, id }),
        { data, credentials: { ...credentials, password } }
      ]);
    },
    update(id, data) {
      return q.Call("biota.Update", [
        Identity(),
        Reference({ collection: name, id }),
        { data }
      ]);
    },
    replace(id, data) {
      return q.Call("biota.Replace", [
        Identity(),
        Reference({ collection: name, id }),
        { data }
      ]);
    },
    upsert(id, data) {
      return q.If(
        q.Exists(Reference({ collection: name, id })),
        collection(name).update(id, data),
        collection(name).insert(data, { id })
      );
    },
    repsert(id, data) {
      return q.If(
        q.Exists(Reference({ collection: name, id })),
        collection(name).replace(id, data),
        collection(name).insert(data, { id })
      );
    },
    delete(id) {
      return q.Call("biota.Delete", [
        Identity(),
        Reference({ collection: name, id })
      ]);
    },
    forget(id) {
      return q.Call("biota.Forget", [
        Identity(),
        Reference({ collection: name, id })
      ]);
    }
  };
}
