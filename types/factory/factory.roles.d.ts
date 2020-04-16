import { Expr } from 'faunadb';
import {
  FaunaPaginateOptions,
  FaunaPaginateMapper,
  FaunaString,
  FaunaDatabaseOptions,
  FaunaRef,
  FaunaTime,
  FaunaNumber,
} from 'types/fauna';

export interface FactoryRolesApi<OT = Expr> {
  findAll(pagination: FaunaPaginateOptions | Expr): OT;
  getMany(nameList: FaunaString[]): OT;
  insertMany(optionsList: FaunaDatabaseOptions[]): OT;
  updateMany(optionsList: FaunaDatabaseOptions[]): OT;
  upsertMany(optionsList: FaunaDatabaseOptions[]): OT;
  replaceMany(optionsList: FaunaDatabaseOptions[]): OT;
  repsertMany(optionsList: FaunaDatabaseOptions[]): OT;
  deleteMany(refList: FaunaRef[]): OT;
  forgetMany(refList: FaunaRef[]): OT;
  restoreMany(refList: FaunaRef[]): OT;
  expireManyAt(refList: FaunaRef[], at: FaunaTime): OT;
  expireManyIn(refList: FaunaRef[], delay: FaunaNumber): OT;
  expireManyNow(refList: FaunaRef[]): OT;
  dropMany(refList: FaunaRef[]): OT;
}
