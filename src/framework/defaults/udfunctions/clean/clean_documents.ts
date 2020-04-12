import { query as q } from 'faunadb';
import { UDFunction, BiotaFunctionName } from '~/factory/classes/udfunction';
import { clean as cleanFQLUDF } from '~/factory/api/fql/udf/clean';

export const CleanDocuments = UDFunction({
  name: BiotaFunctionName('CleanDocuments'),
  body: q.Query((identity, private_key, collectionName) => cleanFQLUDF.documents(q.Var('collectionName') as any)),
});
