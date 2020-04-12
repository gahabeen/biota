import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { clean as cleanFQLUDF } from '~/factory/api/fql/udf/clean';

export const CleanDocument = UDFunction({
  name: BiotaFunctionName('CleanDocument'),
  body: q.Query(
    q.Lambda(['identity', 'private_key', 'collection', 'id'], cleanFQLUDF.document(q.Var('collection') as any, q.Var('id') as any)),
  ),
});
