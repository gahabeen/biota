// types
import { DBFactoryUpdate } from "~/../types/db";
// external
import { query as q } from "faunadb";
// biota

export const update: DBFactoryUpdate = {
  database: function databaseUpdate(name, options) {
    return q.Update(q.Database(name), options);
  },
  collection: function collectionUpdate(name, options) {
    return q.Update(q.Collection(name), options);
  },
  index: function indexUpdate(name, options) {
    return q.Update(q.Index(name), options);
  },
  function: function functionUpdate(name, options) {
    return q.Update(q.Function(name), options);
  },
  role: function roleUpdate(name, options) {
    return q.Update(q.Role(name), options);
  },
  token: function tokenUpdate(id, options) {
    return q.Update(q.Ref(q.Tokens(), id), options);
  },
  key: function keyUpdate(id, options) {
    return q.Update(q.Ref(q.Keys(), id), options);
  }
};
