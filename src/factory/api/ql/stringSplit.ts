import { query as q, ExprVal, ExprArg } from 'faunadb';

export const StringSplit = (str: ExprArg, delimiter = '.'): ExprVal =>
  q.If(
    q.Not(q.IsString(str)),
    q.Abort('SplitString only accept strings'),
    q.Map(q.FindStrRegex(str, q.Concat(['[^\\', delimiter, ']+'])), q.Lambda('res', q.Select(['data'], q.Var('res')))),
  );
