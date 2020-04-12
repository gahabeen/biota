import { FaunaPaginateOptions } from "../fauna";

export interface BiotaFrameworkDatabaseApi {
  activity: (pagination?: FaunaPaginateOptions) => Promise<any>;
  get: () => Promise<any>;
  replace: (options: object) => Promise<any>;
  update: (options: object) => Promise<any>;
  repsert: (options: object) => Promise<any>;
  upsert: (options: object) => Promise<any>;
  delete: () => Promise<any>;
  forget: () => Promise<any>;
  changes: () => Promise<any>;
}
