// types
import { query as q, Expr } from 'faunadb';
import { FactoryContextDefinition } from 'types/factory/factory.context';
import { FaunaObject, FaunaUDFunctionOptions } from '~/../types/fauna';
import { CONVENTION } from '~/consts';
import { ContextExtend } from './context';

export function BiotaFunctionName(name: string) {
  return `${CONVENTION.UDFUNCTION_PREFIX}${name.replace(CONVENTION.UDFUNCTION_PREFIX, '')}`;
}

export function Input(params: Expr, query: Expr) {
  return q.Let(params, query);
}

export function CallFunction(
  nameOrDefinition: string | FaunaUDFunctionOptions,
  context: FactoryContextDefinition,
  params: FaunaObject,
  query?: Expr,
) {
  const definition = typeof nameOrDefinition === 'object' ? nameOrDefinition : { name: nameOrDefinition };
  return q.Let(
    {
      UDFunctionDefinition: definition,
      UDFunctionQuery: q.Format('%@', query),
    },
    q.Call(
      BiotaFunctionName('CallFunction'),
      ContextExtend(context, 'udf.CallFunction >' + definition.name),
      q.Select('name', q.Var('UDFunctionDefinition'), null),
      params,
    ),
  );
}

export function UDFunction(fn: FaunaUDFunctionOptions): FaunaUDFunctionOptions {
  let { name = '', body, data, role } = fn || {};
  let self = {
    name,
    body,
    data,
    role,
  };

  return self;
}
