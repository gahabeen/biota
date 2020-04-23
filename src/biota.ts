import * as fauna from 'faunadb';
import * as framework from '~/framework';
import { FactoryContextDefinition, FactoryContextInterface } from '~/types/factory/factory.context';
import { Fauna, FaunaId, FaunaRef, FaunaString } from '~/types/fauna';
import { FrameworkCollectionApi } from '~/types/framework/framework.collection';
import { FrameworkCollectionsApi } from '~/types/framework/framework.collections';
import { FrameworkDatabaseApi } from '~/types/framework/framework.database';
import { FrameworkDatabasesApi } from '~/types/framework/framework.databases';
import { FrameworkDocumentApi } from '~/types/framework/framework.document';
import { FrameworkDocumentsApi } from '~/types/framework/framework.documents';
import { FrameworkKeyApi } from '~/types/framework/framework.key';
import { FrameworkRoleApi } from '~/types/framework/framework.role';
import { FrameworkRolesApi } from '~/types/framework/framework.roles';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { bindSubFunctions } from './helpers';
import { FactorySessionApi } from './types/factory/factory.session';
import { FactoryTokenApi } from './types/factory/factory.token';
import { FrameworkCredentialsApi } from './types/framework/framework.credentials';
import { FrameworkCurrentApi } from './types/framework/framework.current';
import { FoundationOptions } from './types/framework/framework.foundation';
import { FrameworkIndexApi } from './types/framework/framework.index';
import { FrameworkIndexesApi } from './types/framework/framework.indexes';
import { FrameworkKeysApi } from './types/framework/framework.keys';
import { FrameworkSessionsApi } from './types/framework/framework.sessions';
import { FrameworkTokensApi } from './types/framework/framework.tokens';
import { FrameworkUDFunctionApi } from './types/framework/framework.udfunction';
import { FrameworkUDFunctionsApi } from './types/framework/framework.udfunctions';
import { FrameworkUsersApi } from './types/framework/framework.users';

// interface BiotaRunningAS {
//   role?: FaunaRef;
//   identity?: FaunaRef;
// }
/**
 * Biota takes at least a secret key to auth your requests.
 *
 * Basic usage example:
 *
 * ```js
 *  const db = new Biota({ secret: <your-secret> })
 *  // which then exposes the whole API
 *  db.query(...)
 * ```
 */
export class Biota {
  client: Fauna.Client;
  private _secret: string;
  private _context: FactoryContextInterface;
  private documentOptions: BiotaOptionsDocument;
  set alternativeIdentity(identity: FaunaRef) {
    // #bug weid that typescript fails to recognize alternativeIdentity
    this._context.alternativeIdentity = identity;
  }
  set test(test: boolean) {
    // #bug weid that typescript fails to recognize alternativeIdentity
    this._context.test = test;
  }
  // eslint-disable-next-line @typescript-eslint/camelcase
  privateKey: (private_key: string) => Promise<unknown>;
  get context(): FactoryContextDefinition {
    return this._context;
  }

  query: (fqlQuery: Fauna.Expr) => unknown;
  paginate: (paginateQuery: Fauna.Expr, paginateOptions?: object) => AsyncGenerator<unknown, unknown, unknown>;

  as: (identity: Fauna.Expr) => this;

  me: FrameworkCurrentApi['user']['me'];
  login: FrameworkCurrentApi['user']['login'];
  register: FrameworkCurrentApi['user']['register'];
  logout: FrameworkCurrentApi['user']['logout'];
  current: FrameworkCurrentApi;

  user: (id?: FaunaId) => FrameworkUserApi;
  users: (collectionName?: string) => FrameworkUsersApi;
  document: (collectionName?: FaunaString | FaunaRef, id?: FaunaString) => FrameworkDocumentApi;
  documents: (collectionName?: FaunaString | FaunaRef) => FrameworkDocumentsApi;
  collection: (name?: FaunaString) => FrameworkCollectionApi;
  collections: FrameworkCollectionsApi;
  database: (name?: FaunaString) => FrameworkDatabaseApi;
  databases: FrameworkDatabasesApi;
  role: (name?: FaunaString) => FrameworkRoleApi;
  roles: FrameworkRolesApi;
  index: (name: string) => FrameworkIndexApi;
  indexes: FrameworkIndexesApi;
  udfunction: (name: string) => FrameworkUDFunctionApi;
  udfunctions: FrameworkUDFunctionsApi;
  credential: (idOrRefOrInstance?: FaunaId | FaunaRef) => FrameworkCredentialsApi;
  credentials: FrameworkCredentialsApi;
  key: (idOrRef: FaunaId | FaunaRef) => FrameworkKeyApi;
  keys: FrameworkKeysApi;
  session: (idOrRef: FaunaId | FaunaRef) => FactorySessionApi;
  sessions: FrameworkSessionsApi;
  token: (idOrRefOrInstance?: FaunaId | FaunaRef) => FactoryTokenApi;
  tokens: FrameworkTokensApi;

  foundation: (options?: FoundationOptions) => Promise<unknown>;
  dismantle: () => Promise<unknown>;
  // relation: FrameworkRelation;

  defaults: unknown;

  constructor(options: BiotaOptions) {
    const { secret, document, offline } = options || {};
    const { annotate = true, logActions = true } = document || {};

    this._secret = secret;
    this._context = {
      alternativeIdentity: null,
      offline,
      annotateDocuments: annotate,
      logActions,
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
      // eslint-disable-next-line no-empty
    } catch (error) {}

    this.query = framework.query.bind(this);
    this.paginate = framework.paginate.bind(this);

    this.current = framework.current;
    bindSubFunctions(this, 'current');

    this.document = framework.document.bind(this);
    this.documents = framework.documents.bind(this);
    this.collection = framework.collection.bind(this);
    this.collections = framework.collections;
    bindSubFunctions(this, 'collections');
    this.database = framework.database.bind(this);
    this.databases = framework.databases;
    bindSubFunctions(this, 'databases');
    this.role = framework.role.bind(this);
    this.roles = framework.roles;
    bindSubFunctions(this, 'roles');
    this.udfunction = framework.udfunction.bind(this);
    this.udfunctions = framework.udfunctions;
    bindSubFunctions(this, 'udfunctions');
    this.session = framework.session.bind(this);
    this.sessions = framework.sessions;
    bindSubFunctions(this, 'sessions');
    this.index = framework.index.bind(this);
    this.indexes = framework.indexes;
    bindSubFunctions(this, 'indexes');
    this.credential = framework.credential.bind(this);
    this.credentials = framework.credentials;
    bindSubFunctions(this, 'credentials');
    this.key = framework.key.bind(this);
    this.keys = framework.keys;
    bindSubFunctions(this, 'keys');
    this.token = framework.token.bind(this);
    this.tokens = framework.tokens;
    bindSubFunctions(this, 'tokens');

    this.foundation = framework.foundation.bind(this);
    this.dismantle = framework.dismantle.bind(this);
    // this.relation = framework.relation.bind(this);

    this.me = this.current.user.me;
    this.register = this.current.user.register;
    this.login = this.current.user.login;
    this.logout = this.current.user.logout;

    this.as = framework.as.bind(this);

    // this.privateKey = framework.privateKey.bind(this);
    // this.defaults = framework.defaults;
  }
}

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
  annotate?: boolean;
  logActions?: boolean;
}

interface BiotaOptions {
  secret: string;
  debug?: boolean;
  document?: BiotaOptionsDocument;
  offline?: boolean;
}
