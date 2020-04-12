import { FaunaIndexOptions } from "../fauna";

export interface BiotaFrameworkIndexApi {
  get: () => Promise<any>;
  insert: (options?: FaunaIndexOptions) => Promise<any>;
  replace: (options?: FaunaIndexOptions) => Promise<any>;
  update: (options?: FaunaIndexOptions) => Promise<any>;
  repsert: (options?: FaunaIndexOptions) => Promise<any>;
  upsert: (options?: FaunaIndexOptions) => Promise<any>;
  delete: () => Promise<any>;
  forget: () => Promise<any>;
  changes: () => Promise<any>;
}
