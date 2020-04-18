import { Expr } from 'faunadb';
import { FactoryTokensApi } from '../factory/factory.tokens';
import { FaunaPaginateOptions } from '../fauna';

export interface FrameworkTokensApi {
  activity: (pagination: FaunaPaginateOptions | Expr) => Promise<any>;
  findAll: FactoryTokensApi<Promise<any>>['findAll'];
  getMany: FactoryTokensApi<Promise<any>>['getMany'];
  insertMany: FactoryTokensApi<Promise<any>>['insertMany'];
  updateMany: FactoryTokensApi<Promise<any>>['updateMany'];
  upsertMany: FactoryTokensApi<Promise<any>>['upsertMany'];
  replaceMany: FactoryTokensApi<Promise<any>>['replaceMany'];
  repsertMany: FactoryTokensApi<Promise<any>>['repsertMany'];
  deleteMany: FactoryTokensApi<Promise<any>>['deleteMany'];
  forgetMany: FactoryTokensApi<Promise<any>>['forgetMany'];
  restoreMany: FactoryTokensApi<Promise<any>>['restoreMany'];
  expireManyAt: FactoryTokensApi<Promise<any>>['expireManyAt'];
  expireManyIn: FactoryTokensApi<Promise<any>>['expireManyIn'];
  expireManyNow: FactoryTokensApi<Promise<any>>['expireManyNow'];
  dropMany: FactoryTokensApi<Promise<any>>['dropMany'];
}
