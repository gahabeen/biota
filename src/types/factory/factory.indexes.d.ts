import { Expr } from 'faunadb';
import {
  FaunaPaginateOptions,
  FaunaRef,
  FaunaString,
  FaunaStringArray,
  FaunaPaginateMapper,
  FaunaIndexOptions,
  FaunaTime,
  FaunaNumber,
} from '~/types/fauna';

export interface FactoryIndexesApi<OT = Expr> {
  findIndex(resource: FaunaRef, termFields: FaunaStringArray): OT;
  searchQuery(resource: FaunaRef, searchTerms: object): OT;
  findByResource(resource: FaunaRef, pagination: FaunaPaginateOptions | Expr): OT;
  findByTerm(term: FaunaString, pagination: FaunaPaginateOptions | Expr): OT;
  findAll(pagination: FaunaPaginateOptions | Expr): OT;
  getMany(nameList: FaunaString[]): OT;
  insertMany(optionsList: FaunaIndexOptions[]): OT;
  updateMany(optionsList: FaunaIndexOptions[]): OT;
  upsertMany(optionsList: FaunaIndexOptions[]): OT;
  replaceMany(optionsList: FaunaIndexOptions[]): OT;
  repsertMany(optionsList: FaunaIndexOptions[]): OT;
  deleteMany(refList: FaunaRef[]): OT;
  forgetMany(refList: FaunaRef[]): OT;
  restoreMany(refList: FaunaRef[]): OT;
  expireManyAt(refList: FaunaRef[], at: FaunaTime): OT;
  expireManyIn(refList: FaunaRef[], delay: FaunaNumber): OT;
  expireManyNow(refList: FaunaRef[]): OT;
  dropMany(refList: FaunaRef[]): OT;
}
