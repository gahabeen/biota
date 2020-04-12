import { query as q } from 'faunadb';
import { FactoryAction } from '~/../types/factory/factory.action';
import { FactoryContext } from '~/../types/factory/factory.context';
import { ContextProp, ContextExtend } from '~/factory/constructors/context';
import { document } from '~/factory/api/document';
import { BiotaCollectionName } from '../constructors/collection';
import { ThrowError } from '../constructors/error';

// tslint:disable-next-line: only-arrow-functions
export const action: FactoryContext<FactoryAction> = function (contextExpr): FactoryAction {
  // tslint:disable-next-line: only-arrow-functions
  return (name, ref) => {
    return {
      insert() {
        const ctx = ContextExtend(contextExpr, 'factory.action.insert');
        return q.If(
          ContextProp(ctx, 'logActions'),
          q.If(
            q.And(q.IsString(action), q.IsRef(ref), q.Now()),
            document(ctx)(BiotaCollectionName('actions')).insert({
              data: {
                name,
                instance: ref,
                ts: q.Now(),
                user: ContextProp(ctx, 'identity'),
              },
            }),
            ThrowError(ctx, 'Wrong inputs', { action, ref, ts: q.Now() }),
          ),
          false,
        );
      },
      annotate() {
        const ctx = ContextExtend(contextExpr, 'factory.action.annotate');
        let _activity = {};
        switch (name) {
          case 'insert':
            _activity = { inserted_by: ContextProp(ctx, 'identity'), inserted_at: q.Now() };
          case 'update':
            _activity = { updated_by: ContextProp(ctx, 'identity'), updated_at: q.Now() };
          case 'replace':
            _activity = { replaced_by: ContextProp(ctx, 'identity'), replaced_at: q.Now() };
          case 'delete_change':
            _activity = { delete_changed_by: ContextProp(ctx, 'identity'), delete_changed_at: q.Now() };
          case 'credentials_change':
            _activity = { credentials_changed_by: ContextProp(ctx, 'identity'), credentials_changed_at: q.Now() };
          case 'auth_email_change':
            _activity = { auth_email_changed_by: ContextProp(ctx, 'identity'), auth_email_changed_at: q.Now() };
          case 'auth_accounts_change':
            _activity = { auth_accounts_changed_by: ContextProp(ctx, 'identity'), auth_accounts_changed_at: q.Now() };
          case 'roles_change':
            _activity = { roles_changed_by: ContextProp(ctx, 'identity'), roles_changed_at: q.Now() };
          case 'owner_change':
            _activity = { owner_changed_by: ContextProp(ctx, 'identity'), owner_changed_at: q.Now() };
          case 'expiration_change':
            _activity = { expiration_changed_by: ContextProp(ctx, 'identity'), expiration_changed_at: q.Now() };
          case 'assignees_change':
            _activity = { assignees_changed_by: ContextProp(ctx, 'identity'), assignees_changed_at: q.Now() };
        }

        return q.If(
          ContextProp(ctx, 'annotateDocuments'),
          document(contextExpr)(ref).update({
            _activity,
          }),
          false,
        );
      },
      dispatch() {
        const ctx = ContextExtend(contextExpr, 'factory.action.dispatch');
        return {
          action: action(ctx)(name, ref).insert(),
          doc: action(ctx)(name, ref).annotate(),
        };
      },
    };
  };
};
