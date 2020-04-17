import { FactoryUserApi, FactoryUser } from 'types/factory/factory.user';
import { FaunaPaginateOptions } from '../fauna';

export type FrameworkUser = FactoryUser<FrameworkUserApi>;

export interface FrameworkUserApi {
  activity: (pagination?: FaunaPaginateOptions) => Promise<any>;
  history: FactoryUserApi<Promise<any>>['history'];
  get: FactoryUserApi<Promise<any>>['get'];
  insert: FactoryUserApi<Promise<any>>['insert'];
  update: FactoryUserApi<Promise<any>>['update'];
  upsert: FactoryUserApi<Promise<any>>['upsert'];
  replace: FactoryUserApi<Promise<any>>['replace'];
  repsert: FactoryUserApi<Promise<any>>['repsert'];
  delete: FactoryUserApi<Promise<any>>['delete'];
  forget: FactoryUserApi<Promise<any>>['forget'];
  drop: FactoryUserApi<Promise<any>>['drop'];
  restore: FactoryUserApi<Promise<any>>['restore'];
  remember: FactoryUserApi<Promise<any>>['remember'];
  expireAt: FactoryUserApi<Promise<any>>['expireAt'];
  expireIn: FactoryUserApi<Promise<any>>['expireIn'];
  expireNow: FactoryUserApi<Promise<any>>['expireNow'];
}
