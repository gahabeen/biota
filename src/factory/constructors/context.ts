import { query as q } from 'faunadb';
import { FactoryContextDefinition } from 'types/factory/factory.context';
import * as helpers from '~/helpers';
import { FaunaString, FaunaObject } from 'types/fauna';

export function ContextsExtend(context: FactoryContextDefinition, offlineFunctionName: FaunaString, onlineFunctionName: FaunaString) {
  return {
    offlineCtx: ContextExtend(context, offlineFunctionName),
    onlineCtx: ContextExtend(context, onlineFunctionName),
  };
}

export function ContextExtend(context: FactoryContextDefinition, functionName: FaunaString): FactoryContextDefinition {
  // DocumentInsert |
  const callstack = q.Concat([q.Select('callstack', context, ''), functionName], '%');
  const offline = q.Select('offline', context, null);
  const identity = q.Select('identity', context, null);
  const hasIdentity = q.IsDoc(identity);
  const session = q.Select('session', context, null);
  const hasSession = q.IsDoc(session);
  const selectedLogActions = q.Select('logActions', context, false);
  const logActions = q.If(q.IsBoolean(selectedLogActions), selectedLogActions, false);
  const selectedAnnotateDocuments = q.Select('annotateDocuments', context, false);
  const annotateDocuments = q.If(q.IsBoolean(selectedAnnotateDocuments), selectedAnnotateDocuments, false);
  const selectedSkipErrors = q.Select('skipErrors', context, false);
  const skipErrors = q.If(q.IsBoolean(selectedSkipErrors), selectedSkipErrors, false);

  return {
    offline,
    identity,
    hasIdentity,
    session,
    hasSession,
    callstack,
    logActions,
    annotateDocuments,
    skipErrors,
  };
}

export function ContextProp(context: FactoryContextDefinition, path: string) {
  return q.Select(helpers.path(path), context, null);
}
