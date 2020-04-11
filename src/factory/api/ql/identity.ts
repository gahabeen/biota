// types
// external
import * as fauna from 'faunadb';
import { collectionNameNormalized } from '~/factory/classes/collection';
const q = fauna.query;

export function Identity(allowSession: boolean = false) {
  return q.If(
    q.HasIdentity(),
    q.If(
      allowSession,
      q.Identity(),
      q.If(
        q.Equals(q.Select(['collection', 'id'], q.Identity(), null), collectionNameNormalized('user_sessions')),
        q.Select(['data', '_membership', 'owner'], q.Get(q.Identity())),
        q.Identity(),
      ),
    ),
    null,
  );
}
