import { query as q } from 'faunadb';
import { FactoryContextDefinition } from 'types/factory/factory.context';
import { FaunaString } from 'types/fauna';
import * as helpers from '~/helpers';

// export function ContextDefault(context: FactoryContextDefinition = {}) {
//   return {
//     offline: q.Select('offline', context, false),
//     identity: q.Select('identity', context, false),
//     hasIdentity: q.IsDoc(q.Var('identity')),
//     session: q.Select('session', context, false),
//     hasSession: q.Var('hasSession'),
//     callstack: q.Select('callstack', context, 'Biota'),
//     logActions: q.If(q.IsBoolean(q.Var('logActions')), q.Var('logActions'), false),
//     annotateDocuments: q.If(q.IsBoolean(q.Var('annotateDocuments')), q.Var('annotateDocuments'), false),
//     skipErrors: q.If(q.IsBoolean(q.Var('skipErrors')), q.Var('skipErrors'), false),
//   };
// }

export function ContextExtend(
  context: FactoryContextDefinition = {},
  functionName: FaunaString = null,
  params: object = {},
  extend: object = {},
): FactoryContextDefinition {
  return q.Let(
    {
      context,
      functionName,
      offline: q.Select('offline', q.Var('context'), false),
      identity: q.Select('identity', q.Var('context'), q.If(q.HasIdentity(), q.Identity(), null)),
      useRole: q.Select('useRole', q.Var('context'), false),
      hasIdentity: q.IsDoc(q.Var('identity')),
      session: q.Select('session', q.Var('context'), false),
      hasSession: q.IsDoc(q.Var('session')),
      callstack: q.Select('callstack', q.Var('context'), ['Biota']),
      logActions: q.Select('logActions', q.Var('context'), false),
      annotateDocuments: q.Select('annotateDocuments', q.Var('context'), false),
      skipErrors: q.Select('skipErrors', q.Var('context'), false),
    },
    q.Merge(
      {
        offline: q.Var('offline'),
        identity: q.Var('identity'),
        useRole: q.If(q.IsRole(q.Var('useRole')), q.Var('useRole'), false),
        hasIdentity: q.Var('hasIdentity'),
        session: q.Var('session'),
        hasSession: q.Var('hasSession'),
        callstack: q.If(
          q.IsString(q.Var('functionName')),
          q.Union(q.Var('callstack'), [[q.Var('functionName'), q.Format('%@', params)]]),
          q.Var('callstack'),
        ),
        // callstack: q.If(q.IsString(q.Var('functionName')), q.Concat([q.Var('callstack'), q.Var('functionName')], '%'), q.Var('callstack')),
        logActions: q.If(q.IsBoolean(q.Var('logActions')), q.Var('logActions'), false),
        annotateDocuments: q.If(q.IsBoolean(q.Var('annotateDocuments')), q.Var('annotateDocuments'), false),
        skipErrors: q.If(q.IsBoolean(q.Var('skipErrors')), q.Var('skipErrors'), false),
      },
      extend,
    ),
  );
}

export function ContextProp(context: FactoryContextDefinition, path: string) {
  return q.Select(helpers.path(path, false), context, false);
}

export function ContextNoLogNoAnnotation(context: FactoryContextDefinition) {
  return q.Merge(context, { annotateDocuments: false, logActions: false });
}
