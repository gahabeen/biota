// types
import { DBFactoryReplace } from "~/../types/db";
// external
import { query as q } from "faunadb";
// biota
import { DB } from "~/db";

export const replace: DBFactoryReplace = {
  database: function databaseReplace(this: DB, name, options) {
    return q.Replace(q.Database(name), options);
  },
  collection: function collectionReplace(this: DB, name, options) {
    return q.Replace(q.Collection(name), options);
  },
  index: function indexReplace(this: DB, name, options) {
    return q.Replace(q.Index(name), options);
  },
  function: function fuctionReplace(this: DB, name, options) {
    return q.Replace(q.Function(name), options);
  },
  role: function roleReplace(this: DB, name, options) {
    return q.Replace(q.Role(name), options);
  },
  token: function tokenReplace(this: DB, id, options) {
    return q.Replace(q.Ref(q.Tokens(), id), options);
  },
  key: function keyReplace(this: DB, id, options) {
    return q.Replace(q.Ref(q.Keys(), id), options);
  }
};
