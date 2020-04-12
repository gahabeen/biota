import { Rule } from '~/factory/role/rule';
import { query as q } from 'faunadb';

export const are_fields_secure = Rule({
  name: 'are_fields_secure',
  query: q.All([
    q.Equals(q.Select(['data', '_auth'], q.Var('oldDoc'), {}), q.Select(['data', '_auth'], q.Var('newDoc'), {})),
    q.Equals(q.Select(['data', '_membership'], q.Var('oldDoc'), {}), q.Select(['data', '_membership'], q.Var('newDoc'), {})),
    q.Equals(q.Select(['data', '_activity'], q.Var('oldDoc'), {}), q.Select(['data', '_activity'], q.Var('newDoc'), {})),
  ]),
});
