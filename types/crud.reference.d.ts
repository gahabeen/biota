import { Expr } from "faunadb";
import {
  FaunaCollectionOptions,
  FaunaDatabaseOptions,
  FaunaDocumentOptions,
  FaunaId,
  FaunaIndexOptions,
  FaunaKeyOptions,
  FaunaPaginateOptions,
  FaunaRef,
  FaunaRoleOptions,
  FaunaTokenOptions,
  FaunaUDFunctionOptions,
} from "./fauna";

export interface CRUDReferenceDocumentReadOptions {
  resolveRelations?: boolean;
  relationsToResolve?: string[];
}

export interface CRUDReferenceDocument {
  create?(collection: string, options?: FaunaDocumentOptions, id?: FaunaId): Expr;
  read?(collection: string, id: FaunaId, options?: CRUDReferenceDocumentReadOptions): Expr;
  readAll?(pagination?: FaunaPaginateOptions): Expr;
  update?(collection: string, id: FaunaId, options: FaunaDocumentOptions): Expr;
  delete?(collection: string, id: FaunaId): Expr;
}

export interface CRUDReferenceCollection {
  create?(name: string, options?: FaunaCollectionOptions): Expr;
  read?(name: string): Expr;
  readAll?(pagination?: FaunaPaginateOptions): Expr;
  update?(name: string, options: FaunaCollectionOptions): Expr;
  delete?(name: string): Expr;
}

export interface CRUDReferenceDatabase {
  create?(name: string, options?: FaunaDatabaseOptions): Expr;
  read?(name: string): Expr;
  readAll?(pagination?: FaunaPaginateOptions): Expr;
  update?(name: string, options: FaunaDatabaseOptions): Expr;
  delete?(name: string): Expr;
}

export interface CRUDReferenceIndex {
  create?(name: string, options?: FaunaIndexOptions): Expr;
  read?(name: string): Expr;
  readAll?(pagination?: FaunaPaginateOptions): Expr;
  update?(name: string, options: FaunaIndexOptions): Expr;
  delete?(name: string): Expr;
}

export interface CRUDReferenceUDFunction {
  create?(name: string, options?: FaunaUDFunctionOptions): Expr;
  read?(name: string): Expr;
  readAll?(pagination?: FaunaPaginateOptions): Expr;
  update?(name: string, options: FaunaUDFunctionOptions): Expr;
  delete?(name: string): Expr;
}

export interface CRUDReferenceRole {
  create?(name: string, options?: FaunaRoleOptions): Expr;
  read?(name: string): Expr;
  readAll?(pagination?: FaunaPaginateOptions): Expr;
  update?(name: string, options: FaunaRoleOptions): Expr;
  delete?(name: string): Expr;
}

export interface CRUDReferenceToken {
  create?(ref: FaunaRef, options?: FaunaTokenOptions): Expr;
  read?(id: FaunaId): Expr;
  readAll?(pagination?: FaunaPaginateOptions): Expr;
  update?(id: FaunaId, options: FaunaTokenOptions): Expr;
  delete?(id: FaunaId): Expr;
}

export interface CRUDReferenceKey {
  create?(name: string, options?: FaunaKeyOptions): Expr;
  read?(id: FaunaId): Expr;
  readAll?(pagination?: FaunaPaginateOptions): Expr;
  update?(id: FaunaId, options: FaunaKeyOptions): Expr;
  delete?(id: FaunaId): Expr;
}

export interface CRUDReferenceCredentials {
  update?(collection: string, id: FaunaId, credentials: FaunaDocumentOptions["credentials"]): Expr;
  readAll?(pagination?: FaunaPaginateOptions): Expr;
}
