import { query as q } from 'faunadb';
import { expire as expireFQLUDF } from '~/factory/api/fql/udf/expire';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';

export const ExpireDocumentAt = UDFunction({
  name: BiotaFunctionName('ExpireDocumentAt'),
  body: q.Query(
    q.Lambda(
      ['identity', 'private_key', 'collection', 'id', 'at'],
      expireFQLUDF.documentAt(q.Var('collection') as string, q.Var('id'), q.Var('at')),
    ),
  ),
});
