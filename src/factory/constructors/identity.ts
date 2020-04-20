import { query as q } from 'faunadb';
import { BiotaCollectionName } from '~/factory/constructors/collection';

export function Identity(allowSession: boolean = false) {
  return q.If(
    q.HasIdentity(),
    q.If(
      allowSession,
      q.Identity(),
      q.If(
        q.Equals(q.Select(['collection', 'id'], q.Identity(), null), BiotaCollectionName('user_sessions')),
        q.Select(['data', '_membership', 'owner'], q.Get(q.Identity()), null),
        q.Identity(),
      ),
    ),
    null,
  );
}
