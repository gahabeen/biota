import { FaunaPaginateOptions, FaunaDocumentCredentials } from './../fauna';
import { FactoryDocumentApi, FactoryDocument } from 'types/factory/factory.document';

export type FrameworkDocument = FactoryDocument<FrameworkDocumentApi>;

export interface FrameworkDocumentApi {
  activity: (pagination?: FaunaPaginateOptions) => Promise<any>;
  get: FactoryDocumentApi<Promise<any>>['get'];
  insert: FactoryDocumentApi<Promise<any>>['insert'];
  replace: FactoryDocumentApi<Promise<any>>['replace'];
  update: FactoryDocumentApi<Promise<any>>['update'];
  repsert: FactoryDocumentApi<Promise<any>>['repsert'];
  upsert: FactoryDocumentApi<Promise<any>>['upsert'];
  delete: FactoryDocumentApi<Promise<any>>['delete'];
  forget: FactoryDocumentApi<Promise<any>>['forget'];
  restore: FactoryDocumentApi<Promise<any>>['restore'];
  drop: FactoryDocumentApi<Promise<any>>['drop'];
  expireAt: FactoryDocumentApi<Promise<any>>['expireAt'];
  expireIn: FactoryDocumentApi<Promise<any>>['expireIn'];
  expireNow: FactoryDocumentApi<Promise<any>>['expireNow'];
  membership: FactoryDocumentApi<Promise<any>>['membership'];
}
