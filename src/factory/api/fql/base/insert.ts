import { query as q } from "faunadb";
import { DBFactoryFQLBaseInsert } from "~/../types/factory/factory.fql.base";
import { Collection } from "~/factory/classes/collection";
import { Database } from "~/factory/classes/database";
import { Index } from "~/factory/classes/index";
import { Role } from "~/factory/classes/role";
import { UDFunction } from "~/factory/classes/udfunction";

export const insert: DBFactoryFQLBaseInsert = {
  document(collection, data = {}, id) {
    return q.Create(q.If(q.IsString(id), q.Ref(q.Collection(collection), id), q.Collection(collection)), { data });
  },
  database(name, options = {}) {
    return q.CreateDatabase(Database({ ...options, name }));
  },
  collection(name, options = {}) {
    return q.CreateCollection(Collection({ ...options, name }));
  },
  index(name, options = {}) {
    return q.CreateIndex(Index({ ...options, name }));
  },
  udfunction(name, options = {}) {
    return q.CreateFunction(UDFunction({ ...options, name }));
  },
  role(name, options = {}) {
    return q.CreateRole(Role({ ...options, name }));
  },
  token(ref, options = {}) {
    return q.Create(q.Tokens(), { instance: ref, ...options });
  },
  key(name, options = {}) {
    return q.CreateKey({ ...options, name });
  },
};
