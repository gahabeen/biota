import { query as q } from 'faunadb';
import { expire as expireFQLUDF } from '~/factory/api/fql/udf/expire';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';

export const ExpireDocumentIn = UDFunction({
  name: BiotaFunctionName('ExpireDocumentIn'),
  body: q.Query(
    q.Lambda(
      ['identity', 'private_key', 'collection', 'id', 'delayInMs'],
      expireFQLUDF.documentIn(q.Var('collection') as string, q.Var('id'), q.Var('delayInMs') as number),
    ),
  ),
});
