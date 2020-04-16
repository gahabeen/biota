import * as fauna from 'faunadb';
import { Fauna, FaunaId, FaunaRef } from '~/../types/fauna';
import * as framework from '~/framework';
import { FrameworkCollectionApi, FrameworkFoundation, FrameworkRelation } from '../types/framework/framework.collection';
import { FrameworkCollectionsApi } from '../types/framework/framework.collections';
import { FrameworkDatabaseApi } from '../types/framework/framework.database';
import { FrameworkDatabasesApi } from '../types/framework/framework.databases';
import { FrameworkDocumentApi } from '../types/framework/framework.document';
import { FrameworkIndexApi } from '../types/framework/framework.index';
import { FrameworkIndexesApi } from '../types/framework/framework.indexes';
import { FrameworkRoleApi } from '../types/framework/framework.role';
import { FrameworkRolesApi } from '../types/framework/framework.roles';
import { FrameworkUDFunctionApi } from '../types/framework/framework.udfunction';
import { FrameworkUDFunctionsApi } from '../types/framework/framework.udfunctions';
import { FrameworkUserApi } from '../types/framework/framework.user';
import { bindSubFunctions } from './helpers';
import { FactoryContextDefinition } from 'types/factory/factory.context';

interface BiotaOptionsDocumentProtectedPaths {
  _auth: boolean;
  _membership: boolean;
  _validity: boolean;
  _activity: boolean;
  [key: string]: boolean;
}

interface BiotaOptionsDocumentPaths {
  _auth: string | string[];
  '_auth.email'?: string | string[];
  '_auth.accounts'?: string | string[];
  _membership?: string | string[];
  '_membership.owner'?: string | string[];
  '_membership.roles'?: string | string[];
  '_membership.assignees'?: string | string[];
  _validity: string | string[];
  '_validity.deleted'?: string | string[];
  '_validity.expires_at'?: string | string[];
  _activity?: string | string[];
}

interface BiotaOptionsDocument {
  paths?: BiotaOptionsDocumentPaths;
  protectedPaths?: BiotaOptionsDocumentProtectedPaths;
}

interface BiotaOptions {
  secret: string;
  debug?: boolean;
  document?: BiotaOptionsDocument;
}

// interface BiotaRunningAS {
//   role?: FaunaRef;
//   identity?: FaunaRef;
// }

export class Biota {
  client: Fauna.Client;
  _secret: string;
  _context: FactoryContextDefinition;
  // _runningAs: BiotaRunningAS;
  documentOptions: BiotaOptionsDocument;

  query: (fqlQuery: Fauna.Expr) => any;
  paginate: (paginateQuery: Fauna.Expr, paginateOptions?: object) => AsyncGenerator<any, any, any>;

  document?: (collectionName: string, id: FaunaId) => FrameworkDocumentApi;
  user?: FrameworkUserApi;
  collection?: (name: string) => FrameworkCollectionApi;
  collections?: FrameworkCollectionsApi;
  index?: (name: string) => FrameworkIndexApi;
  indexes?: FrameworkIndexesApi;
  role?: (name: string) => FrameworkRoleApi;
  roles?: FrameworkRolesApi;
  database?: (name: string) => FrameworkDatabaseApi;
  databases?: FrameworkDatabasesApi;
  udfunction?: (name: string) => FrameworkUDFunctionApi;
  udfunctions?: FrameworkUDFunctionsApi;

  foundation: FrameworkFoundation;
  relation: FrameworkRelation;

  defaults: any;

  // tslint:disable-next-line: variable-name
  privateKey: (private_key: string) => Promise<any>;
  get context(): FactoryContextDefinition {
    return this._context;
  }


  constructor(options: BiotaOptions) {
    const { secret, debug, document } = options || {};

    this._secret = secret;
    this._context = {
      offline: true,
      asRole: null,
      asIdentity: null
    };

    const { paths = {}, protectedPaths = {} } = document || {};
    this.documentOptions = {};
    this.documentOptions.protectedPaths = {
      _auth: true,
      _membership: true,
      _validity: true,
      _activity: true,
      ...protectedPaths,
    };
    this.documentOptions.paths = {
      _auth: '_auth',
      '_auth.email': '_auth.email',
      '_auth.accounts': '_auth.accounts',
      _membership: '_membership',
      '_membership.owner': '_membership.owner',
      '_membership.roles': '_membership.roles',
      '_membership.assignees': '_membership.assignees',
      _validity: '_validity',
      '_validity.deleted': '_validity.deleted',
      '_validity.expires_at': '_validity.expires_at',
      _activity: '_activity',
      ...paths,
    };

    try {
      this.client = new fauna.Client({ secret });
      // tslint:disable-next-line: no-empty
    } catch (error) {}

    this.query = framework.query.bind(this);
    // this.paginate = framework.paginate.bind(this);
    // this.document = framework.document.bind(this);

    // this.user = framework.user;
    // bindSubFunctions(this, 'user');
    // this.collection = framework.collection.bind(this);
    // this.collections = framework.collections;
    // bindSubFunctions(this, 'collections');
    // this.index = framework.index.bind(this);
    // this.indexes = framework.indexes;
    // bindSubFunctions(this, 'indexes');
    // this.role = framework.role.bind(this);
    // this.roles = framework.roles;
    // bindSubFunctions(this, 'roles');
    // this.database = framework.database.bind(this);
    // this.databases = framework.databases;
    // bindSubFunctions(this, 'databases');
    // this.udfunction = framework.udfunction.bind(this);
    // this.udfunctions = framework.udfunctions;
    // bindSubFunctions(this, 'udfunctions');

    // this.foundation = framework.foundation.bind(this);
    // this.relation = framework.relation.bind(this);

    // this.privateKey = framework.privateKey.bind(this);
    // this.defaults = framework.defaults;
  }
}
