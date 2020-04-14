import { FactoryContextDefinition } from 'types/factory/factory.context';
import { FaunaRef } from 'types/fauna';
import { query as q, Expr } from 'faunadb';

interface ActionDispatchResult {
  action?: object;
  doc?: object;
}

interface ResultInferface {
  context?: FactoryContextDefinition;
  data?: any;
  action?: object;
}
// context: FactoryContextDefinition = {},
export function Result(result: Expr = null, actionResult: ActionDispatchResult = {}, context: Expr = q.Var('ctx')): ResultInferface {
  // const isPlainDocument = (d: any) => q.If(q.IsObject(d), q.Contains(['ref'], d), false);
  return {
    context,
    data: result,
    action: actionResult,
    // action: q.If(q.IsObject(actionResult), q.Select('action', actionResult, null), null),
  };
}

export function ResultData(result: ResultInferface) {
  return q.Select('data', result, null);
}
