import { FaunaPaginateOptions, FaunaPaginateMapper, FaunaString, FaunaDatabaseOptions, FaunaTime, FaunaNumber } from '~/types/fauna';
import { Expr } from 'faunadb';
import { FactoryCollectionsApi } from '~/types/factory/factory.collections';

export interface FrameworkCollectionsApi {
  activity: (pagination: FaunaPaginateOptions | Expr) => Promise<any>;
  findAll: FactoryCollectionsApi<Promise<any>>['findAll'];
  getMany: FactoryCollectionsApi<Promise<any>>['getMany'];
  insertMany: FactoryCollectionsApi<Promise<any>>['insertMany'];
  updateMany: FactoryCollectionsApi<Promise<any>>['updateMany'];
  upsertMany: FactoryCollectionsApi<Promise<any>>['upsertMany'];
  replaceMany: FactoryCollectionsApi<Promise<any>>['replaceMany'];
  repsertMany: FactoryCollectionsApi<Promise<any>>['repsertMany'];
  deleteMany: FactoryCollectionsApi<Promise<any>>['deleteMany'];
  forgetMany: FactoryCollectionsApi<Promise<any>>['forgetMany'];
  restoreMany: FactoryCollectionsApi<Promise<any>>['restoreMany'];
  expireManyAt: FactoryCollectionsApi<Promise<any>>['expireManyAt'];
  expireManyIn: FactoryCollectionsApi<Promise<any>>['expireManyIn'];
  expireManyNow: FactoryCollectionsApi<Promise<any>>['expireManyNow'];
  dropMany: FactoryCollectionsApi<Promise<any>>['dropMany'];
}
