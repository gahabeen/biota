import { FaunaPaginateOptions, FaunaPaginateMapper, FaunaString, FaunaDatabaseOptions, FaunaTime, FaunaNumber } from '~/types/fauna';
import { Expr } from 'faunadb';
import { FactoryKeysApi } from '../factory/factory.keys';

export interface FrameworkKeysApi {
  activity: (pagination: FaunaPaginateOptions | Expr) => Promise<any>;
  findAll: FactoryKeysApi<Promise<any>>['findAll'];
  getMany: FactoryKeysApi<Promise<any>>['getMany'];
  insertMany: FactoryKeysApi<Promise<any>>['insertMany'];
  updateMany: FactoryKeysApi<Promise<any>>['updateMany'];
  upsertMany: FactoryKeysApi<Promise<any>>['upsertMany'];
  replaceMany: FactoryKeysApi<Promise<any>>['replaceMany'];
  repsertMany: FactoryKeysApi<Promise<any>>['repsertMany'];
  deleteMany: FactoryKeysApi<Promise<any>>['deleteMany'];
  forgetMany: FactoryKeysApi<Promise<any>>['forgetMany'];
  restoreMany: FactoryKeysApi<Promise<any>>['restoreMany'];
  expireManyAt: FactoryKeysApi<Promise<any>>['expireManyAt'];
  expireManyIn: FactoryKeysApi<Promise<any>>['expireManyIn'];
  expireManyNow: FactoryKeysApi<Promise<any>>['expireManyNow'];
  dropMany: FactoryKeysApi<Promise<any>>['dropMany'];
}
