import { Expr } from 'faunadb';
import { FaunaDocumentOptionsWithRef, FaunaNumber, FaunaPaginateOptions, FaunaRef, FaunaString, FaunaTime } from '../fauna';

export type FactoryDocuments<OT = FactoryDocumentsApi> = (collection?: FaunaString) => OT;

export interface FactoryDocumentsApi<OT = Expr> {
  findAll(pagination: FaunaPaginateOptions | Expr): OT;
  getMany(nameList: FaunaString[]): OT;
  insertMany(optionsList: FaunaDocumentOptionsWithRef[]): OT;
  updateMany(optionsList: FaunaDocumentOptionsWithRef[]): OT;
  upsertMany(optionsList: FaunaDocumentOptionsWithRef[]): OT;
  replaceMany(optionsList: FaunaDocumentOptionsWithRef[]): OT;
  repsertMany(optionsList: FaunaDocumentOptionsWithRef[]): OT;
  deleteMany(refList: FaunaRef[]): OT;
  forgetMany(refList: FaunaRef[]): OT;
  restoreMany(refList: FaunaRef[]): OT;
  expireManyAt(refList: FaunaRef[], at: FaunaTime): OT;
  expireManyIn(refList: FaunaRef[], delay: FaunaNumber): OT;
  expireManyNow(refList: FaunaRef[]): OT;
  dropMany(refList: FaunaRef[]): OT;
}
