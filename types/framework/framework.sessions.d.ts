import { Expr } from 'faunadb';
import { FaunaPaginateOptions } from '~/../types/fauna';
import { FactorySessionsApi } from '~/../types/factory/factory.sessions';

export interface FrameworkSessionsApi {
  activity: (pagination: FaunaPaginateOptions | Expr) => Promise<any>;
  findAll: FactorySessionsApi<Promise<any>>['findAll'];
  getMany: FactorySessionsApi<Promise<any>>['getMany'];
  insertMany: FactorySessionsApi<Promise<any>>['insertMany'];
  updateMany: FactorySessionsApi<Promise<any>>['updateMany'];
  upsertMany: FactorySessionsApi<Promise<any>>['upsertMany'];
  replaceMany: FactorySessionsApi<Promise<any>>['replaceMany'];
  repsertMany: FactorySessionsApi<Promise<any>>['repsertMany'];
  deleteMany: FactorySessionsApi<Promise<any>>['deleteMany'];
  forgetMany: FactorySessionsApi<Promise<any>>['forgetMany'];
  restoreMany: FactorySessionsApi<Promise<any>>['restoreMany'];
  expireManyAt: FactorySessionsApi<Promise<any>>['expireManyAt'];
  expireManyIn: FactorySessionsApi<Promise<any>>['expireManyIn'];
  expireManyNow: FactorySessionsApi<Promise<any>>['expireManyNow'];
  dropMany: FactorySessionsApi<Promise<any>>['dropMany'];
}
