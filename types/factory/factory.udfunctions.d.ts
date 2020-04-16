import { Expr } from 'faunadb';
import { FaunaPaginateOptions, FaunaPaginateMapper, FaunaString, FaunaRoleOptions, FaunaRef, FaunaTime, FaunaNumber } from 'types/fauna';

export interface FactoryUDFunctionsApi<OT = Expr> {
  findAll(pagination: FaunaPaginateOptions | Expr): OT;
  getMany(nameList: FaunaString[]): OT;
  insertMany(optionsList: FaunaRoleOptions[]): OT;
  updateMany(optionsList: FaunaRoleOptions[]): OT;
  upsertMany(optionsList: FaunaRoleOptions[]): OT;
  replaceMany(optionsList: FaunaRoleOptions[]): OT;
  repsertMany(optionsList: FaunaRoleOptions[]): OT;
  deleteMany(refList: FaunaRef[]): OT;
  forgetMany(refList: FaunaRef[]): OT;
  restoreMany(refList: FaunaRef[]): OT;
  expireManyAt(refList: FaunaRef[], at: FaunaTime): OT;
  expireManyIn(refList: FaunaRef[], delay: FaunaNumber): OT;
  expireManyNow(refList: FaunaRef[]): OT;
  dropMany(refList: FaunaRef[]): OT;
}
