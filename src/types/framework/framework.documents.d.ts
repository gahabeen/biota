import { FactoryDocuments, FactoryDocumentsApi } from '../factory/factory.documents';
import { FaunaPaginateOptions, FaunaPaginateMapper } from '../fauna';
import { Expr } from 'faunadb';

export type FrameworkDocuments = FactoryDocuments<FrameworkDocumentsApi>;

export interface FrameworkDocumentsApi {
  activity: (pagination: FaunaPaginateOptions | Expr) => Promise<any>;
  findAll: FactoryDocumentsApi<Promise<any>>['findAll'];
  getMany: FactoryDocumentsApi<Promise<any>>['getMany'];
  insertMany: FactoryDocumentsApi<Promise<any>>['insertMany'];
  updateMany: FactoryDocumentsApi<Promise<any>>['updateMany'];
  upsertMany: FactoryDocumentsApi<Promise<any>>['upsertMany'];
  replaceMany: FactoryDocumentsApi<Promise<any>>['replaceMany'];
  repsertMany: FactoryDocumentsApi<Promise<any>>['repsertMany'];
  deleteMany: FactoryDocumentsApi<Promise<any>>['deleteMany'];
  forgetMany: FactoryDocumentsApi<Promise<any>>['forgetMany'];
  restoreMany: FactoryDocumentsApi<Promise<any>>['restoreMany'];
  expireManyAt: FactoryDocumentsApi<Promise<any>>['expireManyAt'];
  expireManyIn: FactoryDocumentsApi<Promise<any>>['expireManyIn'];
  expireManyNow: FactoryDocumentsApi<Promise<any>>['expireManyNow'];
  dropMany: FactoryDocumentsApi<Promise<any>>['dropMany'];
}
