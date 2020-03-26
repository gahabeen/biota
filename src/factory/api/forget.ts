// types
import { DBFactoryForget, FaunaId } from "~/../types/db";
// external
import { query as q } from "faunadb";
// biota
import { DB } from "~/db";

export const forget: DBFactoryForget = {
  database: function databaseForget(this: DB, name) {
    return q.Delete(q.Database(name));
  },
  collection: function collectionForget(this: DB, name: string) {
    return q.Delete(q.Collection(name));
  },
  index: function indexForget(this: DB, name: string) {
    return q.Delete(q.Index(name));
  },
  function: function functionForget(this: DB, name: string) {
    return q.Delete(q.Function(name));
  },
  role: function roleForget(this: DB, name: string) {
    return q.Delete(q.Role(name));
  },
  token: function tokenForget(this: DB, id: FaunaId) {
    return q.Delete(q.Ref(q.Tokens(), id));
  },
  key: function keyForget(this: DB, id: FaunaId) {
    return q.Delete(q.Ref(q.Keys(), id));
  }
};
