import { FactoryCredentialApi, FactoryCredential } from '~/types/factory/factory.credential';
import { FaunaPaginateOptions } from '../fauna';

export type FrameworkCredential = FactoryCredential<FrameworkCredentialApi>;

export interface FrameworkCredentialApi {
  activity: (pagination?: FaunaPaginateOptions) => Promise<any>;
  get: FactoryCredentialApi<Promise<any>>['get'];
  insert: FactoryCredentialApi<Promise<any>>['insert'];
  update: FactoryCredentialApi<Promise<any>>['update'];
  replace: FactoryCredentialApi<Promise<any>>['replace'];
  repsert: FactoryCredentialApi<Promise<any>>['repsert'];
  forget: FactoryCredentialApi<Promise<any>>['forget'];
  drop: FactoryCredentialApi<Promise<any>>['drop'];
}
