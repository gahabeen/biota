import { FactoryContextDefinition } from 'types/factory/factory.context';
import { FaunaRef } from 'types/fauna';
import { query as q } from 'faunadb';


interface ActionDispatchResult {
  action?: object;
  doc?: object;
}

interface ResultInferface {
  context?: FactoryContextDefinition;
  data?: any;
  action?: object;
}

export function Result(context: FactoryContextDefinition = {}, result: FaunaRef = null, actionResult: ActionDispatchResult = {}): ResultInferface {
  // const isPlainDocument = (d: any) => q.If(q.IsObject(d), q.Contains(['ref'], d), false);
  return {
    context,
    data: result,
    action: q.Select('action', actionResult, null),
  };
}

export function ResultData(result: ResultInferface) {
  return q.Select('data', result, null);
}
