import { Expr, query as q } from 'faunadb';
import * as fs from 'fs';
import { udfunction } from '~/factory/api/udfunction';
import { FactoryContextDefinition } from '~/types/factory/factory.context';
import { FaunaUDFunctionOptions } from '~/types/fauna';
import { ContextExtend, ContextProp } from '../api/constructors';
import { Result, ResultData } from './result';
import { CallFunction } from './udfunction';

type MethodDispatchOption = { context: FactoryContextDefinition; inputs: object; query: Expr };

export function MethodQuery(query: Expr, result: Expr, action: Expr = null) {
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

export function SafeMethodDispatch(options: MethodDispatchOption) {
  const { context, inputs, query } = options;
  return (offline: string, online: FaunaUDFunctionOptions) => {
    return q.If(
      q.Not(ContextProp(context, 'offline')),
      online ? Online(online)(context, inputs) : null,
      Offline(offline)(context, inputs, query),
    );
  };
}

export function MethodDispatch(options: MethodDispatchOption) {
  const { context, inputs, query } = options;
  return (offline: string, online: FaunaUDFunctionOptions) => {
    let fnCondition: any = false;
    if (online?.name) fnCondition = ResultData(udfunction(context)(online.name).exists());
    return q.If(
      q.And(fnCondition, q.Not(ContextProp(context, 'offline'))),
      online ? Online(online)(context, inputs) : null,
      Offline(offline)(context, inputs, query),
    );
  };
}

type OnlineNext = (context: FactoryContextDefinition, inputs: object) => Expr;
// , query: Expr
export function Online(definition: FaunaUDFunctionOptions) {
  const meta = definition.data?.meta || {};

  const onlineNext: OnlineNext = (context = {}, inputs = {}): Expr => {
    return q.Let(
      {
        UDFunctionDefinition: definition,
        inputs: Object.keys(inputs || {}),
        meta,
      },
      CallFunction(definition, context, inputs),
    );
  };
  return onlineNext;
}

type OfflineNext = (context: FactoryContextDefinition, inputs: object, query: Expr) => Expr;

export function Offline(name: string) {
  const offlineNext: OfflineNext = (context = {}, inputs = {}, query = null): Expr => {
    const ctx = ContextExtend(context, name, inputs);
    fs.writeFileSync('inputs.json', JSON.stringify(inputs));
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
