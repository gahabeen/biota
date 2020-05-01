import { query as q, ExprVal, ExprArg } from 'faunadb';
import { TypeOf } from './TypeOf';

export const StringSplit = (str: ExprArg, delimiter = '.'): ExprVal =>
  q.If(
    q.Not(q.IsString(str)),
    q.Abort(q.Concat(['SplitString only accept strings', TypeOf(str)])),
    q.Map(
      q.Let(
        {
          splitted: q.FindStrRegex(str, q.Concat(['[^\\', delimiter, ']+'])),
        },
        q.If(q.IsNonEmpty(q.Var('splitted')), q.Var('splitted'), [str]),
      ),
      q.Lambda('match', q.Select('data', q.Var('match'), null)),
    ),
  );
