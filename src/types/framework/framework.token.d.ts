import { FactoryTokenApi, FactoryToken } from '~/types/factory/factory.token';
import { FaunaPaginateOptions } from '../fauna';

export type FrameworkToken = FactoryToken<FrameworkTokenApi>;

export interface FrameworkTokenApi {
  activity: (pagination?: FaunaPaginateOptions) => Promise<any>;
  get: FactoryTokenApi<Promise<any>>['get'];
  insert: FactoryTokenApi<Promise<any>>['insert'];
  update: FactoryTokenApi<Promise<any>>['update'];
  upsert: FactoryTokenApi<Promise<any>>['upsert'];
  replace: FactoryTokenApi<Promise<any>>['replace'];
  repsert: FactoryTokenApi<Promise<any>>['repsert'];
  delete: FactoryTokenApi<Promise<any>>['delete'];
  forget: FactoryTokenApi<Promise<any>>['forget'];
  drop: FactoryTokenApi<Promise<any>>['drop'];
  restore: FactoryTokenApi<Promise<any>>['restore'];
  expireAt: FactoryTokenApi<Promise<any>>['expireAt'];
  expireIn: FactoryTokenApi<Promise<any>>['expireIn'];
  expireNow: FactoryTokenApi<Promise<any>>['expireNow'];
}
