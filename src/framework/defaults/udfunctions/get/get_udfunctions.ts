import { query as q } from 'faunadb';
import { get as getFQLUDF } from '~/factory/api/fql/udf/get';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';

export const GetUDFunctions = UDFunction({
  name: BiotaFunctionName('GetUDFunctions'),
  body: q.Query(q.Lambda(['identity'], getFQLUDF.udfunctions())),
});
