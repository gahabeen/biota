import { query as q } from 'faunadb';
import { get as getFQLUDF } from '~/factory/api/fql/udf/get';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';

export const GetRole = UDFunction({
  name: BiotaFunctionName('GetRole'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'name'], getFQLUDF.role(q.Var('name') as any))),
});
