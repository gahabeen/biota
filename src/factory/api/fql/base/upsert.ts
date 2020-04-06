import { query as q } from "faunadb";
import { DBFactoryFQLBaseUpsert } from "~/../types/factory/factory.fql.base";
import { insert } from "~/factory/api/fql/base/insert";
import { update } from "~/factory/api/fql/base/update";

export const upsert: DBFactoryFQLBaseUpsert = {
  document(collection, id, options = {}) {
    return q.If(q.Exists(q.Database(name)), update.document(collection, id, options), insert.document(collection, options, id));
  },
  database(name, options = {}) {
    return q.If(q.Exists(q.Database(name)), update.database(name, options), insert.database(name, options));
  },
  collection(name, options = {}) {
    return q.If(q.Exists(q.Collection(name)), update.collection(name, options), insert.collection(name, options));
  },
  index(name, options = {}) {
    return q.If(q.Exists(q.Index(name)), update.index(name, options), insert.index(name, options));
  },
  udfunction(name, options = {}) {
    return q.If(q.Exists(q.Function(name)), update.udfunction(name, options), insert.udfunction(name, options));
  },
  role(name, options = {}) {
    return q.If(q.Exists(q.Role(name)), update.role(name, options), insert.role(name, options));
  },
  token(ref, options = {}) {
    return insert.token(ref, options);
    // #improve
    // return q.If(q.Exists(q.Ref(q.Tokens(), null)), update.token(id, options), insert.token(ref, options));
  },
  key(id, options = {}) {
    return q.If(q.Exists(q.Ref(q.Keys(), id)), update.key(id, options), insert.key(options.name, options));
  },
};
