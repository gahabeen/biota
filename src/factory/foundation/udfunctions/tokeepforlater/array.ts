// types
// external
import { query as q } from 'faunadb';
// biota
import { UDFunction, BiotaFunctionName } from '~/factory/constructors/udfunction';

export const Reverse = UDFunction({
  name: BiotaFunctionName('Array.Reverse'),
  body: q.Query(
    q.Lambda(['identity', 'arr'], q.Reduce(q.Lambda(['reversed', 'item'], q.Prepend(q.Var('item'), q.Var('reversed'))), [], q.Var('arr'))),
  ),
});
