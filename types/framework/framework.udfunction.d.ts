import { FaunaPaginateOptions } from '../fauna';
import { FactoryUDFunctionApi, FactoryUDFunction } from 'types/factory/factory.udfunction';

export type FrameworkUDFunction = FactoryUDFunction<FrameworkUDFunctionApi>;

export interface FrameworkUDFunctionApi {
  activity: (pagination?: FaunaPaginateOptions) => Promise<any>;
  get: FactoryUDFunctionApi<Promise<any>>['get'];
  insert: FactoryUDFunctionApi<Promise<any>>['insert'];
  update: FactoryUDFunctionApi<Promise<any>>['update'];
  upsert: FactoryUDFunctionApi<Promise<any>>['upsert'];
  replace: FactoryUDFunctionApi<Promise<any>>['replace'];
  repsert: FactoryUDFunctionApi<Promise<any>>['repsert'];
  delete: FactoryUDFunctionApi<Promise<any>>['delete'];
  forget: FactoryUDFunctionApi<Promise<any>>['forget'];
  drop: FactoryUDFunctionApi<Promise<any>>['drop'];
  restore: FactoryUDFunctionApi<Promise<any>>['restore'];
  expireAt: FactoryUDFunctionApi<Promise<any>>['expireAt'];
  expireIn: FactoryUDFunctionApi<Promise<any>>['expireIn'];
  expireNow: FactoryUDFunctionApi<Promise<any>>['expireNow'];
}
