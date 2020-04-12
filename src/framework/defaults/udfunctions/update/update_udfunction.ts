import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { update as updateFQLUDF } from '~/factory/api/fql/udf/update';

export const UpdateUDFunction = UDFunction({
  name: BiotaFunctionName('UpdateUDFunction'),
  body: q.Query(
    q.Lambda(['identity', 'private_key', 'name', 'options'], updateFQLUDF.udfunction(q.Var('name') as any, q.Var('options') as any)),
  ),
});
