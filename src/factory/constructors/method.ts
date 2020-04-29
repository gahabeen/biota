import { Expr, query as q } from 'faunadb';
import { udfunction } from '~/factory/api/udfunction';
import { FactoryContextDefinition } from '~/types/factory/factory.context';
import { FaunaUDFunctionOptions } from '~/types/fauna';
import { ContextExtend, ContextProp } from '../api/constructors';
import { Result, ResultData } from './result';
import { CallFunction } from './udfunction';

type MethodDispatchOption = { context: FactoryContextDefinition; inputs: object; query: Expr; test?: Expr };

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

type OnlineBuilderNextOptions = { context?: FactoryContextDefinition; inputs?: object };
type OnlineBuilderNext = (options: OnlineBuilderNextOptions) => Expr;
export function OnlineBuilder(definition: FaunaUDFunctionOptions) {
  const { meta = {}, ...data } = definition?.data || {};
  // console.log('meta', meta, definition);

  const onlineNext: OnlineBuilderNext = (options): Expr => {
    const { context, inputs } = options;
    return q.Let(
      {
        UDFunctionDefinition: definition,
        inputs: Object.keys(inputs || {}),
        meta,
      },
      CallFunction({ ...definition, data }, context, inputs),
    );
  };
  return onlineNext;
}

type OfflineBuilderNextOptions = { context?: FactoryContextDefinition; inputs?: object; query?: Expr; test?: Expr };
type OfflineBuilderNext = (options: OfflineBuilderNextOptions) => Expr;

export function OfflineBuilder(name: string) {
  const offlineNext: OfflineBuilderNext = ({ context = {}, inputs = {}, query = null, test = null } = {}): Expr => {
    const ctx = ContextExtend(context, name, inputs);
    // return q.If(
    //   q.And(ContextProp(ctx, 'test'), q.Not(q.IsNull(test))),
    //   {
    //     context: ContextTest(ctx, test),
    //   },
    return q.Let(
      {
        ctx,
        ...inputs,
      },
      query,
    );
    // );
  };
  return offlineNext;
}

export function SafeMethodDispatch(options: MethodDispatchOption) {
  const { context, inputs, query, test } = options;
  return (offline: string, online: FaunaUDFunctionOptions) => {
    return q.If(
      q.Not(ContextProp(context, 'offline')),
      online ? OnlineBuilder(online)({ context, inputs }) : null,
      OfflineBuilder(offline)({ context, inputs, query, test }),
    );
  };
}

export function MethodDispatch(options: MethodDispatchOption) {
  const { context, inputs, query, test } = options;
  return (offline: string, online: FaunaUDFunctionOptions) => {
    let fnCondition: any = false;
    if (online?.name) fnCondition = ResultData(udfunction(context)(online.name).exists());
    return q.If(
      q.And(fnCondition, q.Not(ContextProp(context, 'offline'))),
      online ? OnlineBuilder(online)({ context, inputs }) : null,
      OfflineBuilder(offline)({ context, inputs, query, test }),
    );
  };
}
