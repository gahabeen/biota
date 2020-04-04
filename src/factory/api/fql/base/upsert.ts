import { DBFactoryFQLBaseUpsert } from "~/../types/factory/factory.fql.base";
import {
  FaunaDatabaseOptions,
  FaunaCollectionOptions,
  FaunaIndexOptions,
  FaunaUDFunctionOptions,
  FaunaRoleOptions,
  FaunaTokenOptions,
  FaunaKeyOptions,
} from "~/../types/fauna";
import { query as q } from "faunadb";
import { nameOrOptions } from "~/helpers";
import { insert } from "~/factory/api/fql/base/insert";
import { update } from "~/factory/api/fql/base/update";

export const upsert: DBFactoryFQLBaseUpsert = {
  database(name, options = {}) {
    let definition: FaunaDatabaseOptions = nameOrOptions(name, options);
    return q.If(
      q.Exists(q.Database(definition.name)),
      update.database(definition.name, definition),
      insert.database(definition.name, definition)
    );
  },
  collection(name, options = {}) {
    let definition: FaunaCollectionOptions = nameOrOptions(name, options);
    return q.If(
      q.Exists(q.Collection(definition.name)),
      update.collection(definition.name, definition),
      insert.collection(definition.name, definition)
    );
  },
  index(name, options = {}) {
    let definition: FaunaIndexOptions = nameOrOptions(name, options);
    return q.If(q.Exists(q.Index(definition.name)), update.index(definition.name, definition), insert.index(definition.name, definition));
  },
  udfunction(name, options = {}) {
    let definition: FaunaUDFunctionOptions = nameOrOptions(name, options);
    return q.If(
      q.Exists(q.Function(definition.name)),
      update.udfunction(definition.name, definition),
      insert.udfunction(definition.name, definition)
    );
  },
  role(name, options = {}) {
    let definition: FaunaRoleOptions = nameOrOptions(name, options);
    return q.If(q.Exists(q.Role(definition.name)), update.role(definition.name, definition), insert.role(definition.name, definition));
  },
  token(id, options = {}) {
    let definition: FaunaTokenOptions = nameOrOptions(id, options);
    return q.If(
      q.Exists(q.Ref(q.Tokens(), definition.name)),
      update.token(definition.name, definition),
      insert.token(definition.name, definition)
    );
  },
  key(id, options = {}) {
    let definition: FaunaKeyOptions = nameOrOptions(id, options);
    return q.If(q.Exists(q.Ref(q.Keys(), definition.name)), update.key(definition.name, definition), insert.key(definition));
  },
};
