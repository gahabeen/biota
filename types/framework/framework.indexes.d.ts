import { FaunaPaginateOptions, FaunaPaginateMapper, FaunaString, FaunaDatabaseOptions, FaunaTime, FaunaNumber } from 'types/fauna';
import { Expr } from 'faunadb';
import { FactoryIndexesApi } from 'types/factory/factory.indexes';

export interface FrameworkIndexesApi {
  activity: (pagination: FaunaPaginateOptions | Expr) => Promise<any>;
  findIndex: FactoryIndexesApi<Promise<any>>['findIndex'];
  searchQuery: FactoryIndexesApi<Promise<any>>['searchQuery'];
  findByResource: FactoryIndexesApi<Promise<any>>['findByResource'];
  findByTerm: FactoryIndexesApi<Promise<any>>['findByTerm'];
  findAll: FactoryIndexesApi<Promise<any>>['findAll'];
  getMany: FactoryIndexesApi<Promise<any>>['getMany'];
  insertMany: FactoryIndexesApi<Promise<any>>['insertMany'];
  updateMany: FactoryIndexesApi<Promise<any>>['updateMany'];
  upsertMany: FactoryIndexesApi<Promise<any>>['upsertMany'];
  replaceMany: FactoryIndexesApi<Promise<any>>['replaceMany'];
  repsertMany: FactoryIndexesApi<Promise<any>>['repsertMany'];
  deleteMany: FactoryIndexesApi<Promise<any>>['deleteMany'];
  forgetMany: FactoryIndexesApi<Promise<any>>['forgetMany'];
  restoreMany: FactoryIndexesApi<Promise<any>>['restoreMany'];
  expireManyAt: FactoryIndexesApi<Promise<any>>['expireManyAt'];
  expireManyIn: FactoryIndexesApi<Promise<any>>['expireManyIn'];
  expireManyNow: FactoryIndexesApi<Promise<any>>['expireManyNow'];
  dropMany: FactoryIndexesApi<Promise<any>>['dropMany'];
}
