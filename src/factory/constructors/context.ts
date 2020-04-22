import { query as q } from 'faunadb';
import { FactoryContextDefinition } from '~/types/factory/factory.context';
import { FaunaString } from '~/types/fauna';
import * as helpers from '~/helpers';
import { PassportUser, PassportSession } from './identity';

export function ContextExtend(
  context: FactoryContextDefinition = {},
  functionName: FaunaString = null,
  params: object = {},
  // extend: object = {},
): FactoryContextDefinition {
  return q.Let(
    {
      context,
      functionName,
      offline: q.Select('offline', q.Var('context'), false),
      currentIdentity: q.Select('identity', q.Var('context'), null),
      identity: q.If(q.IsRef(q.Var('currentIdentity')), q.Var('currentIdentity'), PassportUser()),
      alternativeIdentity: q.Select('alternativeIdentity', q.Var('context'), null),
      currentSession: q.Select('session', q.Var('context'), null),
      session: q.If(q.IsRef(q.Var('currentSession')), q.Var('currentSession'), PassportSession()),
      hasSession: q.IsDoc(q.Var('session')),
      callstack: q.Select('callstack', q.Var('context'), ['Biota']),
      logActions: q.Select('logActions', q.Var('context'), false),
      annotateDocuments: q.Select('annotateDocuments', q.Var('context'), false),
      skipErrors: q.Select('skipErrors', q.Var('context'), false),
    },
    // q.Merge(
    {
      offline: q.Var('offline'),
      identity: q.Var('identity'),
      alternativeIdentity: q.Var('alternativeIdentity'),
      hasAlternativeIdentity: q.IsRef(q.Var('alternativeIdentity')),
      session: q.Var('session'),
      hasSession: q.Var('hasSession'),
      callstack: q.If(
        q.IsString(q.Var('functionName')),
        q.Union(q.Var('callstack'), [[q.Var('functionName')]]), // #bug q.Format('%@', params)
        q.Var('callstack'),
      ),
      // callstack: q.If(q.IsString(q.Var('functionName')), q.Concat([q.Var('callstack'), q.Var('functionName')], '%'), q.Var('callstack')),
      logActions: q.If(q.IsBoolean(q.Var('logActions')), q.Var('logActions'), false),
      annotateDocuments: q.If(q.IsBoolean(q.Var('annotateDocuments')), q.Var('annotateDocuments'), false),
      skipErrors: q.If(q.IsBoolean(q.Var('skipErrors')), q.Var('skipErrors'), false),
    },
    //   extend,
    // ),
  );
}

export function ContextIdentity(context: FactoryContextDefinition) {
  return ContextProp(context, 'identity');
}

export function ContextSession(context: FactoryContextDefinition) {
  return ContextProp(context, 'session');
}

export function ContextProp(context: FactoryContextDefinition, path: string) {
  return q.Select(helpers.path(path, false), context, false);
}

export function ContextNoLogNoAnnotation(context: FactoryContextDefinition) {
  return q.Merge(context, { annotateDocuments: false, logActions: false });
}
