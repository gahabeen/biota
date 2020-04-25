import { query as q, Expr } from 'faunadb';
import { BiotaCollectionName } from '~/factory/constructors/collection';
import { BiotaFunctionName } from './udfunction';
import { ContextProp } from './context';

export function Identity(allowSession = false) {
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

export function Passport(context = {}) {
  return q.Call(BiotaFunctionName('SessionPassport'), context, {});
  // return q.If(q.Exists(q.Function(BiotaFunctionName('SessionPassport'))), q.Call(BiotaFunctionName('SessionPassport'), {}, {}), {});
}

export function PassportUser(context = {}) {
  return q.Select(['data', 'user'], Passport(context), false);
}

export function PassportSession(context = {}) {
  return q.Select(['data', 'session'], Passport(context), false);
}
