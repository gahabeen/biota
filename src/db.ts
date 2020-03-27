// types
import {
  Fauna,
  DBFactoryQL,
  DBFrameworkCollection,
  DBFrameworkFoundation,
  DBFrameworkRelation,
  DBFrameworkDefault,
  DBFrameworkGraphQL,
  DBFrameworkImport
} from "~/../types/db";
import { Task } from "~/../types/task";
// external
import * as fauna from "faunadb";
// biota
import * as framework from "~/framework";
import { execute } from "~/tasks";

function bindThis(self, rootKey) {
  const resolver = value => {
    let entries = Object.entries(value);
    for (let [key, entry] of entries) {
      if (typeof entry === "object") {
        value[key] = resolver(entry);
      } else if (typeof entry === "function") {
        value[key] = entry.bind(self);
      } else {
        value[key] = entry;
      }
    }
    return value;
  };
  resolver(self[rootKey] || {});
}

export class DB {
  query: (fqlQuery: Fauna.Expr) => any;
  paginate: (paginateQuery: Fauna.Expr, paginateOptions?: object) => any;
  login: (id: Fauna.Expr, password: string) => any;
  execute: (tasks: Task[]) => Promise<void>;

  q: any;
  ql: DBFactoryQL;
  client: Fauna.Client;

  collection: DBFrameworkCollection;
  default: DBFrameworkDefault;
  foundation: DBFrameworkFoundation;
  graphql: DBFrameworkGraphQL;
  import: DBFrameworkImport;
  relation: DBFrameworkRelation;

  constructor({ secret }) {
    this.client = new fauna.Client({ secret });
    this.query = framework.query.bind(this);
    this.paginate = framework.paginate.bind(this);
    this.login = framework.login.bind(this);
    this.execute = execute.bind(this);

    this.foundation = framework.foundation.bind(this);

    this.collection = framework.collection.bind(this);
    bindThis(this, "collection");
    // this.create = framework.create.bind(this)
    // bindThis(this, "collection")
    // this.scaffold = scaffold;
    // bindThis(this, "scaffold");
    // this.create = api.create;
    // bindThis(this, "create");
    // this.update = api.update;
    // bindThis(this, "update");
    // this.upsert = api.upsert;
    // bindThis(this, "upsert");
    // this.replace = api.replace;
    // bindThis(this, "replace");
    // this.forget = api.forget;
    // bindThis(this, "forget");
    // this.me = api.me;
    // bindThis(this, "me");

    // this.get = api.get.get.bind(this);
    // this.collections = api.get.collections.bind(this);
    // this.indexes = api.get.indexes.bind(this);
    // this.functions = api.get.functions.bind(this);
    // this.roles = api.get.roles.bind(this);
    // this.keys = api.get.keys.bind(this);
    // this.tokens = api.get.tokens.bind(this);
    // this.credentials = api.get.credentials.bind(this);
  }
}
