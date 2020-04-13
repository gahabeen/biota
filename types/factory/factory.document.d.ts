import { Expr } from 'faunadb';
import { FaunaData, FaunaRef, FaunaTime } from '../fauna';

export type FactoryDocument = (collectionOrRef: string | Expr | FaunaRef, id?: string | Expr) => FactoryDocumentApi;

export interface FactoryDocumentValidityApi {
  delete(): Expr;
  expire(at: FaunaTime): Expr;
  restore(): Expr;
}

export type FactoryDocumentMembershipAssignee = (assignee: FaunaRef) => FactoryDocumentMembershipAssigneeApi;

export interface FactoryDocumentMembershipAssigneeApi {
  distinct(): Expr;
  difference(): Expr;
  set(): Expr;
  remove(): Expr;
}

export interface FactoryDocumentMembershipOwnerApi {
  set(idOrRef: string | FaunaRef): Expr;
  remove(idOrRef: string | FaunaRef): Expr;
}

export type FactoryDocumentMembershipRole = (roleOrRef: string | FaunaRef) => FactoryDocumentMembershipRoleApi;

export interface FactoryDocumentMembershipRoleApi {
  distinct(): Expr;
  difference(): Expr;
  set(): Expr;
  remove(): Expr;
}

export interface FactoryDocumentMembershipApi {
  role: FactoryDocumentMembershipRole;
  owner: FactoryDocumentMembershipOwnerApi;
  assignee: FactoryDocumentMembershipAssignee;
}

export interface FactoryDocumentApi {
  get(): Expr;
  insert(data: FaunaData): Expr;
  update(data: FaunaData): Expr;
  upsert(data: FaunaData): Expr;
  replace(data: FaunaData): Expr;
  repsert(data: FaunaData): Expr;
  delete(): Expr;
  forget(): Expr;
  restore(): Expr;
  clean(): Expr;
  expireAt(time: Expr): Expr;
  expireIn(delay: number | Expr): Expr;
  expireNow(): Expr;
  validity: FactoryDocumentValidityApi;
  membership: FactoryDocumentMembershipApi;
}
