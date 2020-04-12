import { query as q } from 'faunadb';
import { FaunaString } from 'types/fauna';
import { FactoryContextDefinition } from 'types/factory/factory.context';

export function ThrowError(context: FactoryContextDefinition, message: FaunaString, params?: object) {
  const callstack = q.Select('callstack', context, '');
  const validParams = q.IsObject(params);
  const additionals = q.Format('%@', params);
  const baseMessage = q.Concat(['biota.ThrowError', callstack, message], '|');
  const extendedMessage = q.If(validParams, q.Concat([baseMessage, additionals], '|'), baseMessage);
  return q.Abort(extendedMessage);
}
