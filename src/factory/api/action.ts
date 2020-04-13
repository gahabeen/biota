import { query as q } from 'faunadb';
import { FactoryAction } from '~/../types/factory/factory.action';
import { FactoryContext } from '~/../types/factory/factory.context';
import { ContextProp, ContextExtend } from '~/factory/constructors/context';
import { document } from '~/factory/api/document';
import { BiotaCollectionName } from '../constructors/collection';
import { ThrowError } from '../constructors/error';
import { CallFunction } from '../constructors/udfunction';

// tslint:disable-next-line: only-arrow-functions
export const action: FactoryContext<FactoryAction> = function (context): FactoryAction {
  context = ContextExtend(context);
  const offline = ContextProp(context, 'offline');
  // tslint:disable-next-line: only-arrow-functions
  return (name = null, refOrDoc = null) => {
    const ref = q.If(
      q.IsRef(refOrDoc),
      refOrDoc,
      q.If(q.IsObject(refOrDoc), q.If(q.Contains('ref', refOrDoc), q.Select('ref', refOrDoc, null), null), null),
    );

    return {
      insert() {
        const ctx = ContextExtend(context, 'factory.action.insert');
        return q.If(
          offline,
          q.If(
            ContextProp(ctx, 'logActions'),
            q.If(
              q.And(q.IsString(name), q.IsRef(ref)),
              q.Create(BiotaCollectionName('actions'), {
                data: {
                  name,
                  instance: ref,
                  ts: q.Now(),
                  user: ContextProp(ctx, 'identity'),
                },
              }),
              ThrowError(ctx, 'Wrong inputs', { name, ref, ts: q.Now() }),
            ),
            false,
          ),
          CallFunction('ActionInsert', context, { name, ref }),
        );
      },
      annotate() {
        const ctx = ContextExtend(context, 'factory.action.annotate');
        return q.If(
          offline,
          q.If(
            ContextProp(ctx, 'annotateDocuments'),
            q.Let(
              {
                activity: {
                  insert: { inserted_by: ContextProp(ctx, 'identity'), inserted_at: q.Now() },
                  update: { updated_by: ContextProp(ctx, 'identity'), updated_at: q.Now() },
                  replace: { replaced_by: ContextProp(ctx, 'identity'), replaced_at: q.Now() },
                  delete: { delete_changed_by: ContextProp(ctx, 'identity'), delete_changed_at: q.Now() },
                  credentials_change: { credentials_changed_by: ContextProp(ctx, 'identity'), credentials_changed_at: q.Now() },
                  auth_email_change: { auth_email_changed_by: ContextProp(ctx, 'identity'), auth_email_changed_at: q.Now() },
                  auth_accounts_change: { auth_accounts_changed_by: ContextProp(ctx, 'identity'), auth_accounts_changed_at: q.Now() },
                  roles_change: { roles_changed_by: ContextProp(ctx, 'identity'), roles_changed_at: q.Now() },
                  owner_change: { owner_changed_by: ContextProp(ctx, 'identity'), owner_changed_at: q.Now() },
                  expire: { expiration_changed_by: ContextProp(ctx, 'identity'), expiration_changed_at: q.Now() },
                  assignees_change: { assignees_changed_by: ContextProp(ctx, 'identity'), assignees_changed_at: q.Now() },
                },
                _activity: q.Select(name, q.Var('activity'), null),
              },
              q.If(
                q.IsObject(q.Var('_activity')),
                q.Update(ref, {
                  data: { _activity: q.Var('_activity') },
                }),
                ThrowError(ctx, "This action event doesn't exist", { name }),
              ),
            ),
            false,
          ),
          CallFunction('ActionAnnotate', context, { name, ref }),
        );
      },
      dispatch() {
        const ctx = ContextExtend(context, 'factory.action.dispatch');
        return q.If(
          offline,
          {
            action: action(ctx)(name, ref).insert(),
            doc: action(ctx)(name, ref).annotate(),
          },
          CallFunction('ActionDispatch', context, { name, ref }),
        );
      },
    };
  };
};
