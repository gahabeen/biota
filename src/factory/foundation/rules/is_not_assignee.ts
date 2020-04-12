// types
// external
import { query as q } from 'faunadb';
// biota
import { Rule } from '~/factory/role/rule';

export const is_not_assignee = Rule({
  name: 'is_not_assignee',
  query: q.Not(q.Equals(q.Select(['data', '_activity', 'assignees'], q.Var('doc'), null), q.Identity())),
});
