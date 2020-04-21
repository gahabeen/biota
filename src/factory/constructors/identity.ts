import { query as q } from 'faunadb';
import { BiotaCollectionName } from '~/factory/constructors/collection';
import { BiotaFunctionName } from './udfunction';

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

export function Passport() {
  return q.Call(BiotaFunctionName('SessionPassport'), {}, {});
}

export function PassportUser() {
  return q.Select('user', q.Call(BiotaFunctionName('SessionPassport'), {}, {}), null);
}

export function PassportSession() {
  return q.Select('sessions', q.Call(BiotaFunctionName('SessionPassport'), {}, {}), null);
}
