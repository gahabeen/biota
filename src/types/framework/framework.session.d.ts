import { FactorySessionApi, FactorySession } from '~/types/factory/factory.session';
import { FaunaPaginateOptions } from '../fauna';

export type FrameworkSession = FactorySession<FrameworkSessionApi>;

export interface FrameworkSessionApi {
  passport: FactorySessionApi<Promise<any>>['passport'];
  identity: FactorySessionApi<Promise<any>>['identity'];
  start: FactorySessionApi<Promise<any>>['start'];
  activity: (pagination?: FaunaPaginateOptions) => Promise<any>;
  history: FactorySessionApi<Promise<any>>['history'];
  get: FactorySessionApi<Promise<any>>['get'];
  insert: FactorySessionApi<Promise<any>>['insert'];
  update: FactorySessionApi<Promise<any>>['update'];
  upsert: FactorySessionApi<Promise<any>>['upsert'];
  replace: FactorySessionApi<Promise<any>>['replace'];
  repsert: FactorySessionApi<Promise<any>>['repsert'];
  delete: FactorySessionApi<Promise<any>>['delete'];
  forget: FactorySessionApi<Promise<any>>['forget'];
  drop: FactorySessionApi<Promise<any>>['drop'];
  restore: FactorySessionApi<Promise<any>>['restore'];
  remember: FactorySessionApi<Promise<any>>['remember'];
  expireAt: FactorySessionApi<Promise<any>>['expireAt'];
  expireIn: FactorySessionApi<Promise<any>>['expireIn'];
  expireNow: FactorySessionApi<Promise<any>>['expireNow'];
}
