import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { clean as cleanFQLUDF } from '~/factory/api/fql/udf/clean';

export const CleanKeys = UDFunction({
  name: BiotaFunctionName('CleanKeys'),
  body: q.Query(q.Lambda(['identity'], cleanFQLUDF.keys())),
});
