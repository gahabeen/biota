import { Expr, query as q } from 'faunadb';
import { ActionDispatchResult, ResultInferface } from '~/types/factory/factory.constructors.result';

export function Result(result: Expr = null, actionResult: ActionDispatchResult = {}, context: Expr = q.Var('ctx')): ResultInferface {
  return {
    context,
    data: result,
    action: actionResult,
  };
}

export function ResultRef(result: ResultInferface) {
  return q.Let(
    {
      data: q.Select('data', result, null),
      dataRef: q.Select(['data', 'ref'], result, null),
    },
    q.If(q.IsRef(q.Var('data')), q.Var('data'), q.If(q.IsRef(q.Var('dataRef')), q.Var('dataRef'), null)),
  );
}

export function ResultRefId(result: ResultInferface) {
  return q.Let(
    {
      ref: ResultRef(result),
    },
    q.If(q.IsRef(q.Var('ref')), q.Select('id', q.Var('ref'), null), null),
  );
}

export function ResultData(result: ResultInferface) {
  return q.Select('data', result, null);
}

export function ResultAction(result: ResultInferface) {
  return q.Select('action', result, null);
}
