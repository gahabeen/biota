import { FaunaPaginateOptions, FaunaPaginateMapper } from '~/types/fauna';
import { Expr } from 'faunadb';
import { FactoryUDFunctionsApi } from '~/types/factory/factory.udfunctions';

export interface FrameworkUDFunctionsOptions {
  onlyNecessary?: boolean
}

export interface FrameworkUDFunctionsApi {
  dismantle: () => Promise<any>;
  scaffold: (options?: FrameworkUDFunctionsOptions) => Promise<any>;
  activity: (pagination?: FaunaPaginateOptions | Expr) => Promise<any>;
  findAll: FactoryUDFunctionsApi<Promise<any>>['findAll'];
  getMany: FactoryUDFunctionsApi<Promise<any>>['getMany'];
  insertMany: FactoryUDFunctionsApi<Promise<any>>['insertMany'];
  updateMany: FactoryUDFunctionsApi<Promise<any>>['updateMany'];
  upsertMany: FactoryUDFunctionsApi<Promise<any>>['upsertMany'];
  replaceMany: FactoryUDFunctionsApi<Promise<any>>['replaceMany'];
  repsertMany: FactoryUDFunctionsApi<Promise<any>>['repsertMany'];
  deleteMany: FactoryUDFunctionsApi<Promise<any>>['deleteMany'];
  forgetMany: FactoryUDFunctionsApi<Promise<any>>['forgetMany'];
  restoreMany: FactoryUDFunctionsApi<Promise<any>>['restoreMany'];
  expireManyAt: FactoryUDFunctionsApi<Promise<any>>['expireManyAt'];
  expireManyIn: FactoryUDFunctionsApi<Promise<any>>['expireManyIn'];
  expireManyNow: FactoryUDFunctionsApi<Promise<any>>['expireManyNow'];
  dropMany: FactoryUDFunctionsApi<Promise<any>>['dropMany'];
}
