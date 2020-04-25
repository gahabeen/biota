import { FaunaPaginateOptions } from '../fauna';
import { FactoryKeyApi, FactoryKey } from '../factory/factory.key';

export type FrameworkKey = FactoryKey<FrameworkKeyApi>;

export interface FrameworkKeyApi {
  activity: (pagination?: FaunaPaginateOptions) => Promise<any>;
  get: FactoryKeyApi<Promise<any>>['get'];
  insert: FactoryKeyApi<Promise<any>>['insert'];
  update: FactoryKeyApi<Promise<any>>['update'];
  upsert: FactoryKeyApi<Promise<any>>['upsert'];
  replace: FactoryKeyApi<Promise<any>>['replace'];
  repsert: FactoryKeyApi<Promise<any>>['repsert'];
  // delete: FactoryKeyApi<Promise<any>>['delete'];
  revoke: FactoryKeyApi<Promise<any>>['revoke'];
  forget: FactoryKeyApi<Promise<any>>['forget'];
  drop: FactoryKeyApi<Promise<any>>['drop'];
  // restore: FactoryKeyApi<Promise<any>>['restore'];
  // expireAt: FactoryKeyApi<Promise<any>>['expireAt'];
  // expireIn: FactoryKeyApi<Promise<any>>['expireIn'];
  // expireNow: FactoryKeyApi<Promise<any>>['expireNow'];
}
