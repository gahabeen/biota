import { query as q } from 'faunadb';
import { FaunaString } from 'types/fauna';
import { FactoryContextDefinition } from 'types/factory/factory.context';

export function ThrowError(context: FactoryContextDefinition = {}, message: FaunaString = '', params: object = {}) {
  return q.Let(
    {
      callstack: q.Select('callstack', context, []),
      flat_callstack: q.Concat(
        q.Map(q.Var('callstack'), q.Lambda('step', q.If(q.IsArray(q.Var('step')), q.Concat(q.Var('step'), '%|%'), q.Var('step')))),
        '%%%',
      ),
      message: q.Concat(['biota.ThrowError', q.Var('flat_callstack'), message, q.Format('%@', params), q.Format('%@', context)], '%||%'),
    },
    q.Abort(q.Var('message')),
  );
}
