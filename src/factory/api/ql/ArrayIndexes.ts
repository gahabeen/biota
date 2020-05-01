import { query as q } from 'faunadb';

export const ArrayIndexed = (arr) =>
  q.Reduce(q.Lambda(['acc', 'val'], q.Append([[q.Count(q.Var('acc')), q.Var('val')]], q.Var('acc'))), [], arr);
