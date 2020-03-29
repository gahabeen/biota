// types
import { DBFactoryReplace } from "~/../types/db";
// external
import { query as q } from "faunadb";
// biota
// import { DB } from "~/db";

export const replace: DBFactoryReplace = {
  database: function databaseReplace(name, options) {
    return q.Replace(q.Database(name), options);
  },
  collection: function collectionReplace(name, options) {
    return q.Replace(q.Collection(name), options);
  },
  index: function indexReplace(name, options) {
    return q.Replace(q.Index(name), options);
  },
  function: function fuctionReplace(name, options) {
    return q.Replace(q.Function(name), options);
  },
  role: function roleReplace(name, options) {
    return q.Replace(q.Role(name), options);
  },
  token: function tokenReplace(id, options) {
    return q.Replace(q.Ref(q.Tokens(), id), options);
  },
  key: function keyReplace(id, options) {
    return q.Replace(q.Ref(q.Keys(), id), options);
  }
};
