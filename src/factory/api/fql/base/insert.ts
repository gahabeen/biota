import { DBFactoryFQLBaseInsert } from "~/../types/factory/factory.fql.base";
import { query as q } from "faunadb";
import { Reference } from "~/factory/api/ql";
import { nameOrOptions } from "~/helpers";
import { Database } from "~/factory/classes/database";
import { Collection } from "~/factory/classes/collection";
import { UDFunction } from "~/factory/classes/udfunction";
import { Index } from "~/factory/classes/index";
import { Role } from "~/factory/classes/role";

export const insert: DBFactoryFQLBaseInsert = {
  document(collection, options = {}, id) {
    return q.Create(Reference({ collection, id }), options);
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
  key(name, options) {
    let definition = nameOrOptions(name, options);
    return q.CreateKey(definition);
  },
};
