import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { get as getFQLUDF } from '~/factory/api/fql/udf/get';

export const GetCollections = UDFunction({
  name: BiotaFunctionName('GetCollections'),
  body: q.Query(q.Lambda(['identity'], getFQLUDF.collections())),
});
