import * as Fauna from 'faunadb';
import { ExprArg } from 'faunadb';
import { Fn, FreeObject } from './db';
export { Fauna };

// declare module 'faunadb.query' {
//   // export module query {
//     export function wrap(expr: ExprArg): Fauna.Expr;
//   // }
// }

export type WrapFunction = (expr: ExprArg) => Fauna.Expr;

export interface FaunaPaginateOptions {
  ts?: Fauna.Expr;
  after?: Fauna.Expr;
  before?: Fauna.Expr;
  size?: number;
  events?: boolean;
}

export interface FaunaPaginateResponse {
  data: Fauna.Expr[];
  after: Fauna.Expr[];
  before: Fauna.Expr[];
}

export interface FaunaIndexOptions {
  name?: string;
  source?: FaunaIndexSource;
  terms?: FaunaIndexTerm[];
  values?: FaunaIndexValue[];
  unique?: boolean;
  serialized?: boolean;
  permissions?: object;
  data?: any;
  active?: boolean;
  // addTerm?: Fn<FaunaIndexOptions>;
  // addValue?: Fn<FaunaIndexOptions>;
  // setData?: Fn<FaunaIndexOptions>;
  // toJSON?: Fn<any>;
}

export interface FaunaIndexSource {
  collection?: FaunaRef;
  fields?: FaunaIndexSourceFields;
}

export interface FaunaIndexSourceFields {
  [field: string]: Fauna.Expr;
}

export interface FaunaIndexTerm {
  field?: string | string[];
  binding?: string;
  reverse?: boolean;
}

export interface FaunaIndexValue {
  field?: string | string[];
  binding?: string;
  reverse?: boolean;
}

export interface FaunaCollectionOptions {
  name?: string;
  data?: object;
  history_days?: number;
  ttl_days?: number;
}

export interface FaunaDatabaseOptions {
  name?: string;
  data?: object;
  api_version?: number;
}

export interface FaunaDocument {
  ref?: FaunaRef;
  ts?: number;
  data?: any;
}

export interface FaunaDocumentOptions {
  data?: object;
  credentials?: FaunaDocumentCredentials;
}

export interface FaunaDocumentOptionsWithRef extends FaunaDocumentOptions {
  ref?: FaunaRef;
  data?: object;
  credentials?: FaunaDocumentCredentials;
}

export interface FaunaDocumentCredentials {
  password?: string;
}

export interface FaunaRule {
  name?: string;
  lambda?: FaunaRuleLambda;
  query?: Fauna.Expr;
}

export interface FaunaCredentials {
  ref?: FaunaRef;
  ts?: number;
  instance?: FaunaRef;
  data?: object;
  hashed_password?: string;
}

export interface FaunaKeyOptions {
  name?: string;
  database?: FaunaRef;
  role?: FaunaRef;
  data?: FreeObject;
}

export interface FaunaTokenOptions {
  instance?: FaunaRef;
  data?: FreeObject;
}

export interface FaunaUDFunctionOptions {
  name?: string;
  body?: Fauna.Expr;
  data?: FreeObject;
  role?: FaunaRef | string;
}

export interface FaunaRoleOptions {
  name?: string;
  membership?: FaunaRoleMembership | FaunaRoleMembership[] | Fauna.Expr;
  privileges?: FaunaRolePrivilege[] | Fauna.Expr;
}

export interface FaunaRoleMembership {
  resource?: Fauna.Expr;
  predicate?: Fauna.Expr;
}

export interface FaunaRolePrivilege {
  resource?: Fauna.Expr;
  actions?: FaunaRolePrivilegeActions;
}

export interface FaunaRolePrivilegeActions {
  create?: Fauna.Expr | boolean;
  delete?: Fauna.Expr | boolean;
  read?: Fauna.Expr | boolean;
  write?: Fauna.Expr | boolean;
  history_read?: Fauna.Expr | boolean;
  history_write?: Fauna.Expr | boolean;
  unrestricted_read?: Fauna.Expr | boolean;
  call?: Fauna.Expr | boolean;
}

export interface FaunaRolePrivilegeDefault {
  resource?: Fauna.Expr;
  actions?: FaunaRolePrivilegeActionsDefault;
}

export interface FaunaRolePrivilegeActionsDefault {
  create?: Fauna.Expr | FaunaRuleAction;
  delete?: Fauna.Expr | FaunaRuleAction;
  read?: Fauna.Expr | FaunaRuleAction;
  write?: Fauna.Expr | FaunaRuleAction;
  history_read?: Fauna.Expr | FaunaRuleAction;
  history_write?: Fauna.Expr | FaunaRuleAction;
  unrestricted_read?: Fauna.Expr | FaunaRuleAction;
  call?: Fauna.Expr | FaunaRuleAction;
}

export type FaunaData =
  | {
      [key: string]: any;
    }
  | Fauna.Expr;

export type FaunaPaginateMapper = Fauna.Expr;

export type FaunaRuleAction = 'self_own' | 'secured_fields' | 'self' | 'owner' | 'not_owner' | 'assignee' | 'not_assignee' | 'all' | 'none';

export type FaunaRuleLambda = Fauna.Expr | Fn<Fauna.Expr>;

export type FaunaTime =
  | {
      time: number | string;
    }
  | Fauna.Expr;

export type FaunaCollection = string | Fauna.Expr;
export type FaunaId = string | Fauna.Expr;
export type FaunaRefCollection = {
  collection: FaunaCollection;
};

export type FaunaRef =
  | {
      ref: FaunaRefCollection;
      id: FaunaId;
    }
  | Fauna.Expr;

export type FaunaStringArray = Fauna.Expr;
export type FaunaString = string | Fauna.Expr;
export type FaunaNumber = number | Fauna.Expr;
export type FaunaObject = object | Fauna.Expr;
export type FaunaBoolean = boolean | Fauna.Expr;
