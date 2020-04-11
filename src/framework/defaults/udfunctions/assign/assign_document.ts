import { query as q } from 'faunadb';
import { UDFunction, udfunctionNameNormalized } from '~/factory/classes/udfunction';
import { assign as assignFQLUDF } from '~/factory/api/fql/udf/assign';

export const AssignDocument = UDFunction({
  name: udfunctionNameNormalized('AssignDocument'),
  body: q.Query(
    q.Lambda(
      ['identity', 'private_key', 'collection', 'id', 'newAssignee'],
      assignFQLUDF.document(q.Var('collection') as string, q.Var('id'), q.Var('newAssignee')),
    ),
  ),
});
