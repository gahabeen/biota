import { FaunaPaginateOptions } from '../fauna';
import { FactoryDatabaseApi, FactoryDatabase } from 'types/factory/factory.database';

export type FrameworkDatabase = FactoryDatabase<FrameworkDatabaseApi>;

export interface FrameworkDatabaseApi {
  activity: (pagination?: FaunaPaginateOptions) => Promise<any>;
  get: FactoryDatabaseApi<Promise<any>>['get'];
  insert: FactoryDatabaseApi<Promise<any>>['insert'];
  update: FactoryDatabaseApi<Promise<any>>['update'];
  upsert: FactoryDatabaseApi<Promise<any>>['upsert'];
  replace: FactoryDatabaseApi<Promise<any>>['replace'];
  repsert: FactoryDatabaseApi<Promise<any>>['repsert'];
  delete: FactoryDatabaseApi<Promise<any>>['delete'];
  forget: FactoryDatabaseApi<Promise<any>>['forget'];
  drop: FactoryDatabaseApi<Promise<any>>['drop'];
  restore: FactoryDatabaseApi<Promise<any>>['restore'];
  expireAt: FactoryDatabaseApi<Promise<any>>['expireAt'];
  expireIn: FactoryDatabaseApi<Promise<any>>['expireIn'];
  expireNow: FactoryDatabaseApi<Promise<any>>['expireNow'];
}
