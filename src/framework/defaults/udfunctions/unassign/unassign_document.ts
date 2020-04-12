import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { unassign as unassignFQLUDF } from '~/factory/api/fql/udf/unassign';

export const UnAssignDocument = UDFunction({
  name: BiotaFunctionName('UnAssignDocument'),
  body: q.Query(
    q.Lambda(
      ['identity', 'private_key', 'collection', 'id', 'oldAssignee'],
      unassignFQLUDF.document(q.Var('collection') as any, q.Var('id') as any, q.Var('oldAssignee') as any),
    ),
  ),
});
