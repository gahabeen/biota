// types
import { Fauna } from '~/../types/db';
// external
import { query as q } from 'faunadb';

// Harvested from https://github.com/shiftx/faunadb-fql-lib/blob/master/src/functions/StringSplit.ts
export const StringSplit = (string: Fauna.Expr, delimiter = '.'): Fauna.Expr =>
  q.If(
    q.Not(q.IsString(string)),
    q.Abort('SplitString only accept strings'),
    q.Map(q.FindStrRegex(string, q.Concat(['[^\\', delimiter, ']+'])), q.Lambda('res', q.Select(['data'], q.Var('res')))),
  );
