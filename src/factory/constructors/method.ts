import { query as q, Expr } from 'faunadb';
import { FactoryContextDefinition } from 'types/factory/factory.context';
import { FaunaUDFunctionOptions } from 'types/fauna';
import { ContextProp, ContextExtend } from '../api/constructors';
import { CallFunction } from './udfunction';
import { Result } from './result';

type MethodDispatchOption = { context: FactoryContextDefinition; inputs: object; query: Expr };

// type QueryNext = (ctx: Expr) => Expr;

export function Query(query: Expr, result: Expr, action: Expr = null) {
  const actionData = q.Let(
    {
      action,
      isResult: q.And(
        q.Contains(['context'], q.Var('action')),
        q.Contains(['data'], q.Var('action')),
        q.Contains(['action'], q.Var('action')),
      ),
    },
    q.If(q.Var('isResult'), q.Select('data', q.Var('action'), null), q.Var('action')),
  );
  return q.Let(query, Result(result, actionData));
}

export function MethodDispatch(options: MethodDispatchOption) {
  const { context, inputs, query } = options;
  // return (offline: OfflineNext, online: OnlineNext) => {
  return (offline: string, online: string | FaunaUDFunctionOptions) => {
    return q.If(ContextProp(context, 'offline'), Offline(offline)(context, inputs, query), online ? Online(online)(context, inputs) : null); // query
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
    const ctx = ContextExtend(context, name, inputs);
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
