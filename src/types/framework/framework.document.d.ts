import { FaunaPaginateOptions, FaunaDocumentCredentials, FaunaRef } from './../fauna';
import { FactoryDocumentApi, FactoryDocument } from '~/types/factory/factory.document';
import { Expr } from 'faunadb';

export type FrameworkDocument = FactoryDocument<FrameworkDocumentApi>;

export interface FrameworkDocumentApi {
  activity: (pagination?: FaunaPaginateOptions) => Promise<any>;
  history: FactoryDocumentApi<Promise<any>>['history'];
  get: FactoryDocumentApi<Promise<any>>['get'];
  insert: FactoryDocumentApi<Promise<any>>['insert'];
  replace: FactoryDocumentApi<Promise<any>>['replace'];
  update: FactoryDocumentApi<Promise<any>>['update'];
  repsert: FactoryDocumentApi<Promise<any>>['repsert'];
  upsert: FactoryDocumentApi<Promise<any>>['upsert'];
  delete: FactoryDocumentApi<Promise<any>>['delete'];
  forget: FactoryDocumentApi<Promise<any>>['forget'];
  restore: FactoryDocumentApi<Promise<any>>['restore'];
  remember: FactoryDocumentApi<Promise<any>>['remember'];
  drop: FactoryDocumentApi<Promise<any>>['drop'];
  expireAt: FactoryDocumentApi<Promise<any>>['expireAt'];
  expireIn: FactoryDocumentApi<Promise<any>>['expireIn'];
  expireNow: FactoryDocumentApi<Promise<any>>['expireNow'];
  membership: FactoryDocumentApi<Promise<any>>['membership'];
}
