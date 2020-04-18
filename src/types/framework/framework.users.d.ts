import { FaunaPaginateOptions, FaunaPaginateMapper, FaunaString, FaunaDatabaseOptions, FaunaTime, FaunaNumber } from '~/types/fauna';
import { Expr } from 'faunadb';
import { FactoryUsersApi } from '~/types/factory/factory.users';

export interface FrameworkUsersApi {
  activity: (pagination: FaunaPaginateOptions | Expr) => Promise<any>;
  getByAuthAccount: FactoryUsersApi<Promise<any>>['getByAuthAccount']
  getByAuthEmail: FactoryUsersApi<Promise<any>>['getByAuthAccount']
  findAll: FactoryUsersApi<Promise<any>>['findAll'];
  getMany: FactoryUsersApi<Promise<any>>['getMany'];
  insertMany: FactoryUsersApi<Promise<any>>['insertMany'];
  updateMany: FactoryUsersApi<Promise<any>>['updateMany'];
  upsertMany: FactoryUsersApi<Promise<any>>['upsertMany'];
  replaceMany: FactoryUsersApi<Promise<any>>['replaceMany'];
  repsertMany: FactoryUsersApi<Promise<any>>['repsertMany'];
  deleteMany: FactoryUsersApi<Promise<any>>['deleteMany'];
  forgetMany: FactoryUsersApi<Promise<any>>['forgetMany'];
  restoreMany: FactoryUsersApi<Promise<any>>['restoreMany'];
  expireManyAt: FactoryUsersApi<Promise<any>>['expireManyAt'];
  expireManyIn: FactoryUsersApi<Promise<any>>['expireManyIn'];
  expireManyNow: FactoryUsersApi<Promise<any>>['expireManyNow'];
  dropMany: FactoryUsersApi<Promise<any>>['dropMany'];
}
