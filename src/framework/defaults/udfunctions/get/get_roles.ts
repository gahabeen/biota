import { query as q } from 'faunadb';
import { get as getFQLUDF } from '~/factory/api/fql/udf/get';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';

export const GetRoles = UDFunction({
  name: BiotaFunctionName('GetRoles'),
  body: q.Query(q.Lambda(['identity'], getFQLUDF.roles())),
});
