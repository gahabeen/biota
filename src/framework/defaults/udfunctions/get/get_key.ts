import { query as q } from 'faunadb';
import { get as getFQLUDF } from '~/factory/api/fql/udf/get';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';

export const GetKey = UDFunction({
  name: BiotaFunctionName('GetKey'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'id'], getFQLUDF.key(q.Var('id') as any))),
});
