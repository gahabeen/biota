import { Expr } from 'faunadb';
import { FaunaPaginateOptions, FaunaString, FaunaCollectionOptions, FaunaRef, FaunaPaginateMapper } from '../fauna';

export interface FactoryCollectionsApi<OT = Expr> {
  findAll(pagination: FaunaPaginateOptions | Expr): OT;
  getMany(nameList: FaunaString[]): OT;
  insertMany(optionsList: FaunaCollectionOptions[]): OT;
  updateMany(optionsList: FaunaCollectionOptions[]): OT;
  upsertMany(optionsList: FaunaCollectionOptions[]): OT;
  replaceMany(optionsList: FaunaCollectionOptions[]): OT;
  repsertMany(optionsList: FaunaCollectionOptions[]): OT;
  deleteMany(refList: FaunaRef[]): OT;
  forgetMany(refList: FaunaRef[]): OT;
  restoreMany(refList: FaunaRef[]): OT;
  expireManyAt(refList: FaunaRef[], time: OT): OT;
  expireManyIn(refList: FaunaRef[], time: OT): OT;
  expireManyNow(refList: FaunaRef[]): OT;
  dropMany(refList: FaunaRef[]): OT;
}
