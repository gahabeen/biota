import Debug from "debug";
import * as fauna from "faunadb";
import { Fauna } from "~/../types/fauna";
import * as framework from "~/framework";
import {
  DBFrameworkCollectionApi,
  DBFrameworkFoundation,
  DBFrameworkIndexOptions,
  DBFrameworkRelation,
} from "../types/framework/framework.collection";

// function bindThis(self, rootKey) {
//   const resolver = (value) => {
//     let entries = Object.entries(value);
//     for (let [key, entry] of entries) {
//       if (typeof entry === "object") {
//         value[key] = resolver(entry);
//       } else if (typeof entry === "function") {
//         value[key] = entry.bind(self);
//       } else {
//         value[key] = entry;
//       }
//     }
//     return value;
//   };
//   resolver(self[rootKey] || {});
// }

interface DBOptions {
  secret: string;
  debug?: boolean;
}

export class DB {
  client: Fauna.Client;

  query: (fqlQuery: Fauna.Expr) => any;
  paginate: (paginateQuery: Fauna.Expr, paginateOptions?: object) => AsyncGenerator<any, any, any>;

  login: (id: Fauna.Expr, password: string) => any;
  logout: (everywhere: boolean) => any;

  collection?: (name: string) => DBFrameworkCollectionApi;
  index?: (name: string) => DBFrameworkIndexOptions;

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
    // this.logout = framework.logout.bind(this);

    this.collection = framework.collection.bind(this);
    this.index = framework.index.bind(this);

    this.foundation = framework.foundation.bind(this);
    this.relation = framework.relation.bind(this);
  }
}
