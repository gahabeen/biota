import { Expr } from 'faunadb';
import { DocumentActionName } from 'types/document';
import { FaunaData, FaunaNumber, FaunaRef, FaunaTime } from '../fauna';

export type FactoryDocument<OT = FactoryDocumentApi> = (collectionOrRef?: string | Expr | FaunaRef, id?: string | Expr) => OT;

export interface FactoryDocumentValidityApi<OT = Expr> {
  delete(): OT;
  expire(at: FaunaTime): OT;
  restore(): OT;
}

export type FactoryDocumentMembershipAssignee<OT = Expr> = (assignee: FaunaRef) => FactoryDocumentMembershipAssigneeApi<OT>;

export interface FactoryDocumentMembershipAssigneeApi<OT = Expr> {
  distinct?(): OT;
  difference?(): OT;
  set(): OT;
  remove(): OT;
}

export interface FactoryDocumentMembershipOwnerApi<OT = Expr> {
  set(idOrRef: string | FaunaRef): OT;
  remove(idOrRef: string | FaunaRef): OT;
}

export type FactoryDocumentMembershipRole<OT = Expr> = (roleOrRef: string | FaunaRef) => FactoryDocumentMembershipRoleApi<OT>;

export interface FactoryDocumentMembershipRoleApi<OT = Expr> {
  distinct?(): OT;
  difference?(): OT;
  set(): OT;
  remove(): OT;
}

export interface FactoryDocumentMembershipApi<OT = Expr> {
  role: FactoryDocumentMembershipRole<OT>;
  owner: FactoryDocumentMembershipOwnerApi<OT>;
  assignee: FactoryDocumentMembershipAssignee<OT>;
}

export interface FactoryDocumentApi<OT = Expr> {
  get(): OT;
  insert(data: FaunaData): OT;
  update(data: FaunaData): OT;
  upsert(data: FaunaData): OT;
  replace(data: FaunaData): OT;
  repsert(data: FaunaData): OT;
  delete(): OT;
  forget(): OT;
  restore(): OT;
  drop(): OT;
  expireAt(time: FaunaTime): OT;
  expireIn(delay: FaunaNumber): OT;
  expireNow(): OT;
  validity: FactoryDocumentValidityApi<OT>;
  membership: FactoryDocumentMembershipApi<OT>;
  annotate(action: DocumentActionName, data?: FaunaData): OT;
}
