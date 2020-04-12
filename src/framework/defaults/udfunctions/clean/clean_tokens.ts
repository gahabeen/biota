import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { clean as cleanFQLUDF } from '~/factory/api/fql/udf/clean';

export const CleanTokens = UDFunction({
  name: BiotaFunctionName('CleanTokens'),
  body: q.Query(q.Lambda(['identity'], cleanFQLUDF.tokens())),
});
