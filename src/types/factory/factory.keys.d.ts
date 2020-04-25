import { Expr } from 'faunadb';
import { FaunaKeyOptions, FaunaPaginateOptions, FaunaRef, FaunaString } from '~/types/fauna';

export interface FactoryKeysApi<OT = Expr> {
  findAll(pagination: FaunaPaginateOptions | Expr): OT;
  getMany(nameList: FaunaString[]): OT;
  insertMany(optionsList: FaunaKeyOptions[]): OT;
  updateMany(optionsList: FaunaKeyOptions[]): OT;
  upsertMany(optionsList: FaunaKeyOptions[]): OT;
  replaceMany(optionsList: FaunaKeyOptions[]): OT;
  repsertMany(optionsList: FaunaKeyOptions[]): OT;
  // deleteMany(refList: FaunaRef[]): OT;
  revokeMany(refList: FaunaRef[]): OT;
  forgetMany(refList: FaunaRef[]): OT;
  dropMany(refList: FaunaRef[]): OT;
  // restoreMany(refList: FaunaRef[]): OT;
  // expireManyAt(refList: FaunaRef[], at: FaunaTime): OT;
  // expireManyIn(refList: FaunaRef[], delay: FaunaNumber): OT;
  // expireManyNow(refList: FaunaRef[]): OT;
}
