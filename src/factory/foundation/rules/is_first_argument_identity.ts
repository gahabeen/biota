// types
// external
import { query as q } from 'faunadb';
// biota
import { Rule } from '~/factory/constructors/role/rule';
import { Identity } from '~/factory/api/ql';

export const is_first_argument_identity = Rule({
  name: 'is_first_argument_identity',
  query: q.Lambda(
    'args',
    q.Let(
      {
        identity: q.Select(0, q.Var('args'), null),
      },
      q.If(q.IsNull(q.Var('identity')), q.Abort('No identity provided'), q.Equals(q.Var('identity'), Identity())),
    ),
  ),
});
