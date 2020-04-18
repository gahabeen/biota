import { FactoryCredentialsApi } from '~/types/factory/factory.credentials';

export interface FrameworkCredentialsApi {
  findAll: FactoryCredentialsApi<Promise<any>>['findAll'];
  findByInstance: FactoryCredentialsApi<Promise<any>>['findByInstance'];
}
