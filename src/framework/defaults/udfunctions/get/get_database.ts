import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { get as getFQLUDF } from '~/factory/api/fql/udf/get';

export const GetDatabase = UDFunction({
  name: BiotaFunctionName('GetDatabase'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'name'], getFQLUDF.database(q.Var('name') as any))),
});
