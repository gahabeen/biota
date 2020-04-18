import { FaunaPaginateOptions, FaunaPaginateMapper, FaunaString, FaunaDatabaseOptions, FaunaTime, FaunaNumber } from '~/types/fauna';
import { Expr } from 'faunadb';
import { FactoryRolesApi } from '~/types/factory/factory.roles';

export interface FrameworkRolesScaffoldOptions {
  defaultRoles: string[];
  baseOnly: boolean;
}

export interface FrameworkRolesApi {
  scaffold: (options: FrameworkRolesScaffoldOptions) => Promise<any>;
  activity: (pagination: FaunaPaginateOptions | Expr) => Promise<any>;
  findAll: FactoryRolesApi<Promise<any>>['findAll'];
  getMany: FactoryRolesApi<Promise<any>>['getMany'];
  insertMany: FactoryRolesApi<Promise<any>>['insertMany'];
  updateMany: FactoryRolesApi<Promise<any>>['updateMany'];
  upsertMany: FactoryRolesApi<Promise<any>>['upsertMany'];
  replaceMany: FactoryRolesApi<Promise<any>>['replaceMany'];
  repsertMany: FactoryRolesApi<Promise<any>>['repsertMany'];
  deleteMany: FactoryRolesApi<Promise<any>>['deleteMany'];
  forgetMany: FactoryRolesApi<Promise<any>>['forgetMany'];
  restoreMany: FactoryRolesApi<Promise<any>>['restoreMany'];
  expireManyAt: FactoryRolesApi<Promise<any>>['expireManyAt'];
  expireManyIn: FactoryRolesApi<Promise<any>>['expireManyIn'];
  expireManyNow: FactoryRolesApi<Promise<any>>['expireManyNow'];
  dropMany: FactoryRolesApi<Promise<any>>['dropMany'];
}
