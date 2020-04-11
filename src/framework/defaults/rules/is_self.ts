import { query as q } from 'faunadb';
import { Rule } from '~/factory/role/rule';
import { Identity } from '~/factory/api/ql';

export const is_self = Rule({
  name: 'is_self',
  query: q.Let(
    {
      reference: q.Select('ref', q.Var('doc'), null),
    },
    q.If(q.IsRef(q.Var('reference')), q.Equals(q.Var('reference'), Identity()), false),
  ),
});
