import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { clean as cleanFQLUDF } from '~/factory/api/fql/udf/clean';

export const CleanCollections = UDFunction({
  name: BiotaFunctionName('CleanCollections'),
  body: q.Query(q.Lambda(['identity'], cleanFQLUDF.collections())),
});
