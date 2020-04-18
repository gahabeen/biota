import { FactoryIndex, FactoryIndexApi } from '~/types/factory/factory.index';
import { FaunaPaginateOptions } from '../fauna';

export type FrameworkIndex = FactoryIndex<FrameworkIndexApi>;

export interface FrameworkIndexApi {
  activity: (pagination?: FaunaPaginateOptions) => Promise<any>;
  get: FactoryIndexApi<Promise<any>>['get'];
  insert: FactoryIndexApi<Promise<any>>['insert'];
  update: FactoryIndexApi<Promise<any>>['update'];
  upsert: FactoryIndexApi<Promise<any>>['upsert'];
  replace: FactoryIndexApi<Promise<any>>['replace'];
  repsert: FactoryIndexApi<Promise<any>>['repsert'];
  delete: FactoryIndexApi<Promise<any>>['delete'];
  forget: FactoryIndexApi<Promise<any>>['forget'];
  drop: FactoryIndexApi<Promise<any>>['drop'];
  restore: FactoryIndexApi<Promise<any>>['restore'];
  expireAt: FactoryIndexApi<Promise<any>>['expireAt'];
  expireIn: FactoryIndexApi<Promise<any>>['expireIn'];
  expireNow: FactoryIndexApi<Promise<any>>['expireNow'];
}
