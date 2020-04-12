import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { update as updateFQLUDF } from '~/factory/api/fql/udf/update';

export const UpdateCollection = UDFunction({
  name: BiotaFunctionName('UpdateCollection'),
  body: q.Query(
    q.Lambda(['identity', 'private_key', 'name', 'options'], updateFQLUDF.collection(q.Var('name') as any, q.Var('options') as any)),
  ),
});
