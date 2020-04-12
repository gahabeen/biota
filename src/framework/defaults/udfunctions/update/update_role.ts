import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { update as updateFQLUDF } from '~/factory/api/fql/udf/update';

export const UpdateRole = UDFunction({
  name: BiotaFunctionName('UpdateRole'),
  body: q.Query(q.Lambda(['identity', 'private_key', 'name', 'options'], updateFQLUDF.role(q.Var('name') as string, q.Var('options')))),
});
