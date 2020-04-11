import { query as q } from 'faunadb';
import { UDFunction, udfunctionNameNormalized } from '~/factory/classes/udfunction';
import { get as getFQLUDF } from '~/factory/api/fql/udf/get';

export const GetDatabases = UDFunction({
  name: udfunctionNameNormalized('GetDatabases'),
  body: q.Query(q.Lambda(['identity'], getFQLUDF.databases())),
});
