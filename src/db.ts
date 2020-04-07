import Debug from "debug";
import * as fauna from "faunadb";
import { Fauna, FaunaId } from "~/../types/fauna";
import * as framework from "~/framework";
import {
  DBFrameworkCollectionApi,
  DBFrameworkFoundation,
  DBFrameworkIndexOptions,
  DBFrameworkRelation,
} from "../types/framework/framework.collection";
import { DBFrameworkIndexesApi } from "../types/framework/framework.indexes";
import { DBFrameworkRolesApi } from "../types/framework/framework.roles";
import { DBFrameworkDocumentApi } from "../types/framework/framework.document";
import { DBFrameworkUserApi } from "../types/framework/framework.user";

function bindThis(self, rootKey) {
  const resolver = (value) => {
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
  client: Fauna.Client;

  query: (fqlQuery: Fauna.Expr) => any;
  paginate: (paginateQuery: Fauna.Expr, paginateOptions?: object) => AsyncGenerator<any, any, any>;

  user?: DBFrameworkUserApi;
  collection?: (name: string) => DBFrameworkCollectionApi;
  document?: (collectionName: string, id: FaunaId) => DBFrameworkDocumentApi;
  index?: (name: string) => DBFrameworkIndexOptions;
  indexes?: DBFrameworkIndexesApi;
  roles?: DBFrameworkRolesApi;

  foundation: DBFrameworkFoundation;
  relation: DBFrameworkRelation;

  constructor(options: DBOptions) {
    let { secret, debug } = options || {};
    const log = Debug("biota");
    log.enabled = debug;

    this.client = new fauna.Client({ secret });

    this.query = framework.query.bind(this);
    this.paginate = framework.paginate.bind(this);

    this.collection = framework.collection.bind(this);
    this.document = framework.document.bind(this);
    this.index = framework.index.bind(this);
    this.indexes = framework.indexes;
    bindThis(this, "indexes");
    this.roles = framework.roles;
    bindThis(this, "roles");
    this.user = framework.user;
    bindThis(this, "user");

    this.foundation = framework.foundation.bind(this);
    this.relation = framework.relation.bind(this);
  }
}
