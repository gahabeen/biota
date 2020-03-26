// types
import {
  DBFactoryUpsert,
  FaunaDatabaseOptions,
  FaunaCollectionOptions,
  FaunaIndexOptions,
  FaunaFunctionOptions,
  FaunaRoleOptions,
  FaunaTokenOptions,
  FaunaKeyOptions
} from "~/../types/db";
// external
import { query as q } from "faunadb";
// biota
import { nameOrOptions } from "~/helpers";
import { create } from "~/factory/api/create";
import { update } from "~/factory/api/update";

export const upsert: DBFactoryUpsert = {
  database: function databaseUpsert(name, options = {}) {
    let definition: FaunaDatabaseOptions = nameOrOptions(name, options);
    return q.If(
      q.Exists(q.Database(definition.name)),
      update.database(definition.name, definition),
      create.database(definition.name, definition)
    );
  },
  collection: function collectionUpsert(name, options = {}) {
    let definition: FaunaCollectionOptions = nameOrOptions(name, options);
    return q.If(
      q.Exists(q.Collection(definition.name)),
      update.collection(definition.name, definition),
      create.collection(definition.name, definition)
    );
  },
  index: function indexUpsert(name, options = {}) {
    let definition: FaunaIndexOptions = nameOrOptions(name, options);
    return q.If(
      q.Exists(q.Index(definition.name)),
      update.index(definition.name, definition),
      create.index(definition.name, definition)
    );
  },
  function: function functionUpsert(name, options = {}) {
    let definition: FaunaFunctionOptions = nameOrOptions(name, options);
    return q.If(
      q.Exists(q.Function(definition.name)),
      update.function(definition.name, definition),
      create.function(definition.name, definition)
    );
  },
  role: function roleUpsert(name, options = {}) {
    let definition: FaunaRoleOptions = nameOrOptions(name, options);
    return q.If(
      q.Exists(q.Role(definition.name)),
      update.role(definition.name, definition),
      create.role(definition.name, definition)
    );
  },
  token: function tokenUpsert(id, options = {}) {
    let definition: FaunaTokenOptions = nameOrOptions(id, options);
    return q.If(
      q.Exists(q.Ref(q.Tokens(), definition.name)),
      update.token(definition.name, definition),
      create.token(definition.name, definition)
    );
  },
  key: function keyUpsert(id, options = {}) {
    let definition: FaunaKeyOptions = nameOrOptions(id, options);
    return q.If(
      q.Exists(q.Ref(q.Keys(), definition.name)),
      update.key(definition.name, definition),
      create.key(definition)
    );
  }
};
