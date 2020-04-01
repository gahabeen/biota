import Debug from "debug";
import * as fauna from "faunadb";
import {
  DBFactoryQL,
  DBFramework,
  DBFrameworkCollection,
  DBFrameworkDefault,
  DBFrameworkFoundation,
  DBFrameworkRelation,
  Fauna,
  FaunaCollectionOptions
} from "~/../types/db";
import { Task } from "~/../types/task";
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

interface DBOptions {
  secret: string;
  debug?: boolean;
}

export class DB {
  query: (fqlQuery: Fauna.Expr) => any;
  paginate: (paginateQuery: Fauna.Expr, paginateOptions?: object) => AsyncGenerator<any, any, any>;
  login: (id: Fauna.Expr, password: string) => any;
  logout: (everywhere: boolean) => any;
  execute: (tasks: Task[]) => Promise<void>;

  ql: DBFactoryQL;
  client: Fauna.Client;

  framework: DBFramework;

  collection: (collectionName: string | FaunaCollectionOptions) => DBFrameworkCollection;
  default: DBFrameworkDefault;
  foundation: DBFrameworkFoundation;
  relation: DBFrameworkRelation;

  constructor(options: DBOptions) {
    let { secret, debug } = options || {};
    const log = Debug("biota");
    log.enabled = debug;

    this.client = new fauna.Client({ secret });
    this.query = framework.query.bind(this);
    this.paginate = framework.paginate.bind(this);
    this.login = framework.login.bind(this);
    this.relation = framework.relation.bind(this);
    this.execute = execute.bind(this);

    this.foundation = framework.foundation.bind(this);

    this.collection = framework.collection.bind(this);

    this.framework = framework;
    bindThis(this, "framework");
  }
}
