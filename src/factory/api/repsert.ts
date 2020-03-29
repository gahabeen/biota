// types
import {
  FaunaDatabaseOptions,
  DBFactoryRepsert,
  FaunaCollectionOptions,
  FaunaIndexOptions,
  FaunaFunctionOptions,
  FaunaKeyOptions,
  FaunaRoleOptions,
  FaunaTokenOptions
} from "~/../types/db";
// external
import { query as q } from "faunadb";
// biota
import { nameOrOptions } from "~/helpers";
import { create } from "~/factory/api/create";
import { replace } from "~/factory/api/replace";

export const repsert: DBFactoryRepsert = {
  database: function databaseReplace(name, options) {
    let definition: FaunaDatabaseOptions = nameOrOptions(name, options);
    return q.If(
      q.Exists(q.Database(definition.name)),
      replace.database(definition.name, definition),
      create.database(definition.name, definition)
    );
  },
  collection: function collectionReplace(name, options) {
    let definition: FaunaCollectionOptions = nameOrOptions(name, options);
    return q.If(
      q.Exists(q.Collection(definition.name)),
      replace.collection(definition.name, definition),
      create.collection(definition.name, definition)
    );
  },
  index: function indexReplace(name, options) {
    let definition: FaunaIndexOptions = nameOrOptions(name, options);
    return q.If(
      q.Exists(q.Index(definition.name)),
      replace.index(definition.name, definition),
      create.index(definition.name, definition)
    );
  },
  function: function fuctionReplace(name, options) {
    let definition: FaunaFunctionOptions = nameOrOptions(name, options);
    return q.If(
      q.Exists(q.Function(definition.name)),
      replace.function(definition.name, definition),
      create.function(definition.name, definition)
    );
  },
  role: function roleReplace(name, options) {
    let definition: FaunaRoleOptions = nameOrOptions(name, options);
    return q.If(
      q.Exists(q.Role(definition.name)),
      replace.role(definition.name, definition),
      create.role(definition.name, definition)
    );
  },
  token: function tokenReplace(id, options) {
    let definition: FaunaTokenOptions = nameOrOptions(id, options);
    return q.If(
      q.Exists(q.Ref(q.Tokens(), definition.name)),
      replace.token(definition.name, definition),
      create.token(definition.name, definition)
    );
  },
  key: function keyReplace(id, options) {
    let definition: FaunaKeyOptions = nameOrOptions(id, options);
    return q.If(
      q.Exists(q.Ref(q.Keys(), definition.name)),
      replace.key(definition.name, definition),
      create.key(definition)
    );
  }
};
