import { query as q, Expr } from 'faunadb';
import { BiotaCollectionName } from '~/factory/constructors/collection';
import { BiotaFunctionName } from './udfunction';
import { ContextProp } from './context';

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

export function AlternativeOrIdentity(context: Expr) {
  return q.Let(
    {
      context,
      alternativeIdentity: ContextProp(q.Var('context'), 'alternativeIdentity'),
    },
    q.If(q.IsRef(q.Var('alternativeIdentity')), q.Var('alternativeIdentity'), PassportUser()),
  );
}

export function Passport() {
  return q.If(q.Exists(q.Function(BiotaFunctionName('SessionPassport'))), q.Call(BiotaFunctionName('SessionPassport'), {}, {}), {});
}

export function PassportUser() {
  return q.Select('user', Passport(), false);
}

export function PassportSession() {
  return q.Select('sessions', Passport(), false);
}
