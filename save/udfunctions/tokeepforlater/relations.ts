import { query as q } from 'faunadb';
import { BiotaCollectionName } from '~/factory/constructors/collection';
import { UDFunction, BiotaFunctionName } from '~/factory/constructors/udfunction';
import { Identity } from '~/factory/api/ql';

export const Relations = UDFunction({
  name: BiotaFunctionName('Relations'),
  body: q.Query(
    q.Lambda(
      ['identity', 'private_key', 'ref'],
      q.If(
        q.And(q.IsRef(q.Var('ref')), q.Exists(q.Var('ref'))),
        q.Let(
          {
            relations: q.Map(
              q.Paginate(
                q.Call(BiotaFunctionName('SearchQuery'), Identity(), q.Collection(BiotaCollectionName('relations')), {
                  'parts.collection': q.Select('collection', q.Var('ref'), null),
                }),
                { size: 1000 },
              ),
              (x) => q.Get(x),
            ),
          },
          q.If(q.Not(q.IsEmpty(q.Var('relations'))), q.Var('relations'), []),
        ),
        q.Abort("Ref doesn't exists"),
      ),
    ),
  ),
});
