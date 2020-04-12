import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { get as getFQLUDF } from '~/factory/api/fql/udf/get';

export const GetCollection = UDFunction({
  name: BiotaFunctionName('GetCollection'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'name'], getFQLUDF.collection(q.Var('name') as any))),
});
