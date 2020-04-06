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
  FaunaTime,
} from "./fauna";

export interface CRUDReferenceDocumentReadOptions {
  expired?: boolean;
  deleted?: boolean;
  forgotten?: boolean;
  relations?: boolean;
  relationsNames?: string[];
}

export interface CRUDReferenceDocument {
  create?(collection: string, data?: any, id?: FaunaId): Expr;
  read?(collection: string, id: FaunaId, options?: CRUDReferenceDocumentReadOptions): Expr;
  readAll?(pagination?: FaunaPaginateOptions): Expr;
  cleanAll?(collection: string): Expr;
  update?(collection: string, id: FaunaId, data: any): Expr;
  upsert?(collection: string, id: FaunaId, data: any): Expr;
  delete?(collection: string, id: FaunaId): Expr;
  expire?(collection: string, id: FaunaId, at: FaunaTime): Expr;
  own?(collection: string, id: FaunaId, newOwner: FaunaRef): Expr;
  assign?(collection: string, id: FaunaId, newAssignee: FaunaRef): Expr;
  unassign?(collection: string, id: FaunaId, newAssignee: FaunaRef): Expr;
}

export interface CRUDReferenceCollection {
  create?(name: string, options?: FaunaCollectionOptions): Expr;
  read?(name: string): Expr;
  readAll?(pagination?: FaunaPaginateOptions): Expr;
  cleanAll?(): Expr;
  update?(name: string, options: FaunaCollectionOptions): Expr;
  upsert?(name: string, options: FaunaCollectionOptions): Expr;
  delete?(name: string): Expr;
}

export interface CRUDReferenceDatabase {
  create?(name: string, options?: FaunaDatabaseOptions): Expr;
  read?(name: string): Expr;
  readAll?(pagination?: FaunaPaginateOptions): Expr;
  cleanAll?(): Expr;
  update?(name: string, options: FaunaDatabaseOptions): Expr;
  upsert?(name: string, options: FaunaDocumentOptions): Expr;
  delete?(name: string): Expr;
}

export interface CRUDReferenceIndex {
  create?(name: string, options?: FaunaIndexOptions): Expr;
  read?(name: string): Expr;
  readAll?(pagination?: FaunaPaginateOptions): Expr;
  cleanAll?(): Expr;
  update?(name: string, options: FaunaIndexOptions): Expr;
  upsert?(name: string, options: FaunaDocumentOptions): Expr;
  delete?(name: string): Expr;
}

export interface CRUDReferenceUDFunction {
  create?(name: string, options?: FaunaUDFunctionOptions): Expr;
  read?(name: string): Expr;
  readAll?(pagination?: FaunaPaginateOptions): Expr;
  cleanAll?(): Expr;
  update?(name: string, options: FaunaUDFunctionOptions): Expr;
  upsert?(name: string, options: FaunaUDFunctionOptions): Expr;
  delete?(name: string): Expr;
}

export interface CRUDReferenceRole {
  create?(name: string, options?: FaunaRoleOptions): Expr;
  read?(name: string): Expr;
  readAll?(pagination?: FaunaPaginateOptions): Expr;
  cleanAll?(): Expr;
  update?(name: string, options: FaunaRoleOptions): Expr;
  upsert?(name: string, options: FaunaRoleOptions): Expr;
  delete?(name: string): Expr;
}

export interface CRUDReferenceToken {
  create?(ref: FaunaRef, options?: FaunaTokenOptions): Expr;
  read?(id: FaunaId): Expr;
  readAll?(pagination?: FaunaPaginateOptions): Expr;
  cleanAll?(): Expr;
  update?(id: FaunaId, options: FaunaTokenOptions): Expr;
  upsert?(ref: FaunaRef, options: FaunaTokenOptions): Expr;
  delete?(id: FaunaId): Expr;
}

export interface CRUDReferenceKey {
  create?(name: string, options?: FaunaKeyOptions): Expr;
  read?(id: FaunaId): Expr;
  readAll?(pagination?: FaunaPaginateOptions): Expr;
  cleanAll?(): Expr;
  update?(id: FaunaId, options: FaunaKeyOptions): Expr;
  upsert?(name: string, options: FaunaKeyOptions): Expr;
  delete?(id: FaunaId): Expr;
}

export interface CRUDReferenceCredentials {
  update?(collection: string, id: FaunaId, credentials: FaunaDocumentOptions["credentials"]): Expr;
  readAll?(pagination?: FaunaPaginateOptions): Expr;
}
