import { Expr } from 'faunadb';
import { FaunaData, FaunaRef, FaunaTime } from '../fauna';

export type FactoryDocument = (collectionOrRef: string | Expr | FaunaRef, id?: string | Expr) => FactoryDocumentApi;

export interface FactoryDocumentValidityApi {
  delete(): Expr;
  expire(at: FaunaTime): Expr;
  restore(): Expr;
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
  clean(): Expr;
  expireAt(time: Expr): Expr;
  expireIn(delay: number | Expr): Expr;
  expireNow(): Expr;
  validity: FactoryDocumentValidityApi;
}
