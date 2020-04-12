import { query as q } from 'faunadb';
import { Rule } from '~/factory/role/rule';
import { Identity } from '~/factory/api/ql';

export const is_owner = Rule({
  name: 'is_owner',
  query: q.Equals(q.Select(['data', '_membership', 'owner'], q.Var('doc'), null), Identity()),
});
