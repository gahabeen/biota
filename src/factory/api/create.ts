// types
import { DBFactoryCreate } from "~/../types/db";
// external
import { query as q } from "faunadb";
// biota
import { nameOrOptions } from "~/helpers";
// relative
import { Database } from "./database";
import { Collection } from "./collection";
import { Index } from "./index";
import { UDFunction } from "./udfunction";
import { Role } from "./role";

export const create: DBFactoryCreate = {
  database: function databaseCreate(name, options = {}) {
    let definition = nameOrOptions(name, options);
    return q.CreateDatabase(Database(definition));
  },
  collection: function collectionCreate(name, options = {}) {
    let definition = nameOrOptions(name, options);
    return q.CreateCollection(Collection(definition));
  },
  index: function indexCreate(name, options = {}) {
    let definition = nameOrOptions(name, options);
    return q.CreateIndex(Index(definition));
  },
  function: function functionCreate(name, options = {}) {
    let definition = nameOrOptions(name, options);
    return q.CreateFunction(UDFunction(definition));
  },
  role: function roleCreate(name, options = {}) {
    let definition = nameOrOptions(name, options);
    return q.CreateRole(Role(definition));
  },
  token: function tokenCreate(ref, options = {}) {
    return q.Create(q.Tokens(), { instance: ref, ...options });
  },
  key: function keyCreate(options) {
    return q.CreateKey(options);
  }
};
