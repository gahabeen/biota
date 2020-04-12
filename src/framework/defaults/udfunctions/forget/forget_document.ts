import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { forget as forgetFQLUDF } from '~/factory/api/fql/udf/forget';

export const ForgetDocument = UDFunction({
  name: BiotaFunctionName('ForgetDocument'),
  body: q.Query(
    q.Lambda(['identity', 'private_key', 'collection', 'id'], forgetFQLUDF.document(q.Var('collection') as any, q.Var('id') as any)),
  ),
});
