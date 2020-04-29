import { query as q, ExprArg } from 'faunadb';

const nestedMerger = (count: number) => {
  return q.Lambda(
    ['key1', 'a1', 'b1'],
    q.If(
      q.And(q.IsObject(q.Var('a1')), q.IsObject(q.Var('b1'))),
      q.Merge(q.Var('a1'), q.Var('b1'), count > 0 ? nestedMerger(count - 1) : undefined),
      q.Var('b1'),
    ),
  );
};

export const DeepMerge = (obj1: ExprArg, obj2: ExprArg, mergeDepth = 4) => {
  return q.Merge(obj1, obj2, mergeDepth > 1 ? nestedMerger(mergeDepth - 2) : undefined);
};
