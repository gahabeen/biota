import { query as q } from 'faunadb';
import { Rule } from '~/factory/role/rule';
import { Identity } from '~/factory/api/ql';

export const is_assignee = Rule({
  name: 'is_assignee',
  query: q.Let(
    {
      raw_assignees: q.Select(['data', '_activity', 'assignees'], q.Var('doc'), []),
      assignees: q.If(q.IsArray(q.Var('raw_assignees')), q.Var('raw_assignees'), []),
    },
    q.Not(q.IsEmpty(q.Filter(q.Var('assignees'), q.Lambda('assignee', q.Equals(q.Var('assignee'), Identity()))))),
  ),
});
