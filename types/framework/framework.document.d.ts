import { FaunaPaginateOptions, FaunaDocumentCredentials } from "./../fauna";

export interface DBFrameworkDocumentApi {
  activity: (pagination?: FaunaPaginateOptions) => Promise<any>;
  get: () => Promise<any>;
  replace: (data: object) => Promise<any>;
  update: (data: object) => Promise<any>;
  repsert: (data: object) => Promise<any>;
  upsert: (data: object) => Promise<any>;
  delete: () => Promise<any>;
  forget: () => Promise<any>;
  changes: () => Promise<any>;
}
