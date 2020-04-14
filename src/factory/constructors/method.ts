import { query as q, Expr } from 'faunadb';
import { FactoryContextDefinition } from 'types/factory/factory.context';
import { FaunaUDFunctionOptions } from 'types/fauna';
import { ContextProp, ContextExtend } from '../api/constructors';
import { CallFunction } from './udfunction';
import { Result } from './result';

type MethodDispatchOption = { context: FactoryContextDefinition; inputs: object; query: Expr };

// type QueryNext = (ctx: Expr) => Expr;

export function Query(query: Expr, result: Expr, action: Expr = null) {
  return q.Let(query, Result(result, action));
}

export function MethodDispatch(options: MethodDispatchOption) {
  const { context, inputs, query } = options;
  // return (offline: OfflineNext, online: OnlineNext) => {
  return (offline: string, online: string | FaunaUDFunctionOptions) => {
    return q.If(ContextProp(context, 'offline'), Offline(offline)(context, inputs, query), Online(online)(context, inputs)); // query
  };
}

type OnlineNext = (context: FactoryContextDefinition, inputs: object) => Expr;
// , query: Expr
export function Online(nameOrDefinition: string | FaunaUDFunctionOptions) {
  const onlineNext: OnlineNext = (context = {}, inputs = {}): Expr => {
    // , query = null
    return CallFunction(nameOrDefinition, context, inputs); // query
  };
  return onlineNext;
}

type OfflineNext = (context: FactoryContextDefinition, inputs: object, query: Expr) => Expr;

export function Offline(name: string) {
  const offlineNext: OfflineNext = (context = {}, inputs = {}, query = null): Expr => {
    const ctx = ContextExtend(context, name);
    return q.Let(
      {
        ctx,
        ...inputs,
      },
      query,
    );
  };
  return offlineNext;
}
