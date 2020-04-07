import { query as q } from "faunadb";
import { DBFactoryFQLBaseInsert } from "~/../types/factory/factory.fql.base";
import { Collection } from "~/factory/classes/collection";
import { Database } from "~/factory/classes/database";
import { Index } from "~/factory/classes/index";
import { Role } from "~/factory/classes/role";
import { UDFunction } from "~/factory/classes/udfunction";
import { nameOrOptions } from "~/helpers";

export const insert: DBFactoryFQLBaseInsert = {
  document(collection, data = {}, id) {
    return q.Create(q.If(q.IsString(id), q.Ref(q.Collection(collection), id), q.Collection(collection)), { data });
  },
  database(name, options = {}) {
    let definition = nameOrOptions(name, options);
    return q.CreateDatabase(Database(definition));
  },
  collection(name, options = {}) {
    let definition = nameOrOptions(name, options);
    return q.CreateCollection(Collection(definition));
  },
  index(name, options = {}) {
    let definition = nameOrOptions(name, options);
    return q.CreateIndex(Index(definition));
  },
  udfunction(name, options = {}) {
    let definition = nameOrOptions(name, options);
    return q.CreateFunction(UDFunction(definition));
  },
  role(name, options = {}) {
    let definition = nameOrOptions(name, options);
    return q.CreateRole(Role(definition));
  },
  token(ref, options = {}) {
    return q.Create(q.Tokens(), { instance: ref, ...options });
  },
  key(name, options = {}) {
    let definition = nameOrOptions(name, options);
    return q.CreateKey(definition);
  },
};
