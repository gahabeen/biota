import { Expr, query as q } from 'faunadb';
import { Fauna } from '~/../types/db';
import { Identity } from '~/factory/api/ql';
import { BiotaFunctionName } from '~/factory/constructors/udfunction';

export const CallIsPrivateKeyValid = (identity: Expr, privateKey: Expr) => {
  return q.Call(BiotaFunctionName('IsPrivateKeyValid'), identity, privateKey);
};

export const CallSystemOperator = (action: Fauna.Expr, identity = Identity()) => {
  return q.Call(BiotaFunctionName('SystemOperator'), identity, q.Var('private_key'), action);
};

export const CallLogAction = (name: string, doc: Fauna.Expr) => {
  return q.Call(BiotaFunctionName('LogAction'), Identity(), q.Var('private_key'), {
    document: q.Select('ref', doc, null),
    ts: q.Select('ts', doc, null),
    name,
  });
};
