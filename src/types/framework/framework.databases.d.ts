import { FaunaPaginateOptions, FaunaPaginateMapper, FaunaString, FaunaDatabaseOptions, FaunaTime, FaunaNumber } from '~/types/fauna';
import { Expr } from 'faunadb';
import { FactoryDatabasesApi } from '~/types/factory/factory.databases';

export interface FrameworkDatabasesApi {
  activity: (pagination: FaunaPaginateOptions | Expr) => Promise<any>;
  findAll: FactoryDatabasesApi<Promise<any>>['findAll'];
  getMany: FactoryDatabasesApi<Promise<any>>['getMany'];
  insertMany: FactoryDatabasesApi<Promise<any>>['insertMany'];
  updateMany: FactoryDatabasesApi<Promise<any>>['updateMany'];
  upsertMany: FactoryDatabasesApi<Promise<any>>['upsertMany'];
  replaceMany: FactoryDatabasesApi<Promise<any>>['replaceMany'];
  repsertMany: FactoryDatabasesApi<Promise<any>>['repsertMany'];
  deleteMany: FactoryDatabasesApi<Promise<any>>['deleteMany'];
  forgetMany: FactoryDatabasesApi<Promise<any>>['forgetMany'];
  restoreMany: FactoryDatabasesApi<Promise<any>>['restoreMany'];
  expireManyAt: FactoryDatabasesApi<Promise<any>>['expireManyAt'];
  expireManyIn: FactoryDatabasesApi<Promise<any>>['expireManyIn'];
  expireManyNow: FactoryDatabasesApi<Promise<any>>['expireManyNow'];
  dropMany: FactoryDatabasesApi<Promise<any>>['dropMany'];
}
