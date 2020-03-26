// types
import { FaunaRef, DBFactoryGet } from "~/../types/db";
// external
import { query as q } from "faunadb";
// biota
import { DB } from "~/db";

export const get: DBFactoryGet = {
  get: function documentGet(this: DB, ref: FaunaRef) {
    return q.Get(ref);
  },
  collections: function collectionsGet(this: DB) {
    return q.Paginate(q.Collections(), {});
  },
  indexes: function indexesGet(this: DB) {
    return q.Paginate(q.Indexes(), {});
  },
  functions: function functionsGet(this: DB) {
    return q.Paginate(q.Functions(), {});
  },
  roles: function rolesGet(this: DB) {
    return q.Paginate(q.Roles(), {});
  },
  keys: function keysGet(this: DB) {
    return q.Paginate(q.Keys());
  },
  tokens: function keysGet(this: DB) {
    return q.Paginate(q.Documents(q.Tokens()));
  },
  credentials: function credentialsGet(this: DB) {
    return q.Paginate(q.Documents(q.Credentials()));
  }
};
