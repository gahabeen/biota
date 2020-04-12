// types
import { query as q } from 'faunadb';
import { FactoryContextDefinition } from 'types/factory/factory.context';
import { FaunaObject, FaunaUDFunctionOptions } from '~/../types/fauna';
import { CONVENTION } from '~/consts';
import { ContextExtend } from './context';

export function BiotaFunctionName(name: string) {
  return `${CONVENTION.UDFUNCTION_PREFIX}${name.replace(CONVENTION.UDFUNCTION_PREFIX, '')}`;
}

export function CallUDFunction(name: string, context: FactoryContextDefinition, params: FaunaObject) {
  return q.Call(BiotaFunctionName('CallUDFunction'), ContextExtend(context, 'udf.' + name), name, params);
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
