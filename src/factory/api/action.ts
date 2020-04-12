import { query as q } from 'faunadb';
import { FactoryAction } from '~/../types/factory/factory.action';
import { FactoryContext } from '~/../types/factory/factory.context';
import { ContextProp } from '~/factory/api/ql/context';
import { document } from '~/factory/api/document';
import { collectionNameNormalized } from '~/factory/classes/collection';

// tslint:disable-next-line: only-arrow-functions
export const action: FactoryContext<FactoryAction> = function (contextExpr): FactoryAction {
  // tslint:disable-next-line: only-arrow-functions
  return (name, ref, ts) => {
    const actionApi = action(contextExpr);
    return {
      insert() {
        return q.If(
          q.And(q.IsString(action), q.IsRef(ref), q.IsNumber(ts)),
          document(contextExpr)(collectionNameNormalized('actions')).insert({
            data: {
              name,
              instance: ref,
              ts,
              user: ContextProp(contextExpr, 'identity'),
            },
          }),
          false,
        );
      },
      annotate() {
        let _activity = {};
        switch (name) {
          case 'insert':
            _activity = { inserted_by: ContextProp(contextExpr, 'identity'), inserted_at: q.Now() };
          case 'update':
            _activity = { updated_by: ContextProp(contextExpr, 'identity'), updated_at: q.Now() };
          case 'replace':
            _activity = { replaced_by: ContextProp(contextExpr, 'identity'), replaced_at: q.Now() };
          case 'delete_change':
            _activity = { delete_changed_by: ContextProp(contextExpr, 'identity'), delete_changed_at: q.Now() };
          case 'credentials_change':
            _activity = { credentials_changed_by: ContextProp(contextExpr, 'identity'), credentials_changed_at: q.Now() };
          case 'auth_email_change':
            _activity = { auth_email_changed_by: ContextProp(contextExpr, 'identity'), auth_email_changed_at: q.Now() };
          case 'auth_accounts_change':
            _activity = { auth_accounts_changed_by: ContextProp(contextExpr, 'identity'), auth_accounts_changed_at: q.Now() };
          case 'roles_change':
            _activity = { roles_changed_by: ContextProp(contextExpr, 'identity'), roles_changed_at: q.Now() };
          case 'owner_change':
            _activity = { owner_changed_by: ContextProp(contextExpr, 'identity'), owner_changed_at: q.Now() };
          case 'expiration_change':
            _activity = { expiration_changed_by: ContextProp(contextExpr, 'identity'), expiration_changed_at: q.Now() };
          case 'assignees_change':
            _activity = { assignees_changed_by: ContextProp(contextExpr, 'identity'), assignees_changed_at: q.Now() };
        }

        return document(contextExpr)(ref).update({
          _activity,
        });
      },
      dispatch() {
        return {
          action: actionApi(name, ref, ts).insert(),
          doc: actionApi(name, ref, ts).annotate(),
        };
      },
    };
  };
};
