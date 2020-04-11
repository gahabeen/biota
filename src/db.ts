import * as fauna from 'faunadb';
import { Fauna, FaunaId } from '~/../types/fauna';
import * as framework from '~/framework';
import { DBFrameworkCollectionApi, DBFrameworkFoundation, DBFrameworkRelation } from '../types/framework/framework.collection';
import { DBFrameworkCollectionsApi } from '../types/framework/framework.collections';
import { DBFrameworkDatabaseApi } from '../types/framework/framework.database';
import { DBFrameworkDatabasesApi } from '../types/framework/framework.databases';
import { DBFrameworkDocumentApi } from '../types/framework/framework.document';
import { DBFrameworkIndexApi } from '../types/framework/framework.index';
import { DBFrameworkIndexesApi } from '../types/framework/framework.indexes';
import { DBFrameworkRoleApi } from '../types/framework/framework.role';
import { DBFrameworkRolesApi } from '../types/framework/framework.roles';
import { DBFrameworkUDFunctionApi } from '../types/framework/framework.udfunction';
import { DBFrameworkUDFunctionsApi } from '../types/framework/framework.udfunctions';
import { DBFrameworkUserApi } from '../types/framework/framework.user';
import { bindSubFunctions } from './helpers';

interface DBOptions {
  secret: string;
  debug?: boolean;
  private_key?: string;
}

export class DB {
  client: Fauna.Client;
  private_key: string;
  secret: string;

  query: (fqlQuery: Fauna.Expr) => any;
  paginate: (paginateQuery: Fauna.Expr, paginateOptions?: object) => AsyncGenerator<any, any, any>;

  document?: (collectionName: string, id: FaunaId) => DBFrameworkDocumentApi;
  user?: DBFrameworkUserApi;
  collection?: (name: string) => DBFrameworkCollectionApi;
  collections?: DBFrameworkCollectionsApi;
  index?: (name: string) => DBFrameworkIndexApi;
  indexes?: DBFrameworkIndexesApi;
  role?: (name: string) => DBFrameworkRoleApi;
  roles?: DBFrameworkRolesApi;
  database?: (name: string) => DBFrameworkDatabaseApi;
  databases?: DBFrameworkDatabasesApi;
  udfunction?: (name: string) => DBFrameworkUDFunctionApi;
  udfunctions?: DBFrameworkUDFunctionsApi;

  foundation: DBFrameworkFoundation;
  relation: DBFrameworkRelation;

  defaults: any;

  privateKey: (private_key: string) => Promise<any>;

  constructor(options: DBOptions) {
    let { secret, debug, private_key } = options || {};

    this.secret = secret;
    this.private_key = private_key;

    try {
      this.client = new fauna.Client({ secret });
    } catch (error) {}

    this.query = framework.query.bind(this);
    this.paginate = framework.paginate.bind(this);
    this.document = framework.document.bind(this);

    this.user = framework.user;
    bindSubFunctions(this, 'user');
    this.collection = framework.collection.bind(this);
    this.collections = framework.collections;
    bindSubFunctions(this, 'collections');
    this.index = framework.index.bind(this);
    this.indexes = framework.indexes;
    bindSubFunctions(this, 'indexes');
    this.role = framework.role.bind(this);
    this.roles = framework.roles;
    bindSubFunctions(this, 'roles');
    this.database = framework.database.bind(this);
    this.databases = framework.databases;
    bindSubFunctions(this, 'databases');
    this.udfunction = framework.udfunction.bind(this);
    this.udfunctions = framework.udfunctions;
    bindSubFunctions(this, 'udfunctions');

    this.foundation = framework.foundation.bind(this);
    this.relation = framework.relation.bind(this);

    this.privateKey = framework.privateKey.bind(this);
    this.defaults = framework.defaults;
  }
}
