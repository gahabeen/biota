// types
// external
import * as fauna from 'faunadb';
import { BiotaCollectionName } from '~/factory/classes/collection';
const q = fauna.query;

export function Identity(allowSession: boolean = false) {
  return q.If(
    q.HasIdentity(),
    q.If(
      allowSession,
      q.Identity(),
      q.If(
        q.Equals(q.Select(['collection', 'id'], q.Identity(), null), BiotaCollectionName('user_sessions')),
        q.Select(['data', '_membership', 'owner'], q.Get(q.Identity())),
        q.Identity(),
      ),
    ),
    null,
  );
}
