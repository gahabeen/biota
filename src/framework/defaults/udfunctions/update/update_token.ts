import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { update as updateFQLUDF } from '~/factory/api/fql/udf/update';

export const UpdateToken = UDFunction({
  name: BiotaFunctionName('UpdateToken'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'id', 'options'], updateFQLUDF.token(q.Var('id') as any, q.Var('options') as any))),
});
