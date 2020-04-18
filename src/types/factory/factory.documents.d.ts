import { Expr } from 'faunadb';
import {
  FaunaDocumentOptionsWithRef,
  FaunaNumber,
  FaunaPaginateMapper,
  FaunaPaginateOptions,
  FaunaRef,
  FaunaString,
  FaunaTime,
} from '../fauna';

export type FactoryDocuments<OT = FactoryDocumentsApi> = (collectionOrRef?: string | Expr | FaunaRef) => OT;

export interface FactoryDocumentsApi<OT = Expr> {
  findAll(collectionName: FaunaString, pagination: FaunaPaginateOptions | Expr): OT;
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
