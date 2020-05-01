import { query as q, Expr } from 'faunadb';

export function SafeCall(functionName: Expr, ...params: Expr[]) {
  return q.If(q.Exists(q.Function(functionName)), q.Call(functionName, ...params), {});
}
