import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { get as getFQLUDF } from '~/factory/api/fql/udf/get';

export const GetIndexes = UDFunction({
  name: BiotaFunctionName('GetIndexes'),
  body: q.Query(q.Lambda(['identity'], getFQLUDF.indexes())),
});
