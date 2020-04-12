import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { get as getFQLUDF } from '~/factory/api/fql/udf/get';

export const GetDatabases = UDFunction({
  name: BiotaFunctionName('GetDatabases'),
  body: q.Query(q.Lambda(['identity'], getFQLUDF.databases())),
});
