import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryDocument } from '~/../types/factory/factory.document';
import { TS_2500_YEARS } from '~/consts';
import * as helpers from '~/helpers';
import { ContextProp, ContextExtend } from '../constructors/context';
import { CallUDFunction } from '../constructors/udfunction';
import { action } from '~/factory/api/action';
import { ThrowError } from '../constructors/error';

// tslint:disable-next-line: only-arrow-functions
export const document: FactoryContext<FactoryDocument> = function (contextExpr): FactoryDocument {
  const offline = ContextProp(contextExpr, 'offline');
  // tslint:disable-next-line: only-arrow-functions
  return (collectionOrRef, id) => {
    const ref = q.If(
      q.Or(q.IsDoc(collectionOrRef), q.IsCollection(collectionOrRef)),
      collectionOrRef,
      q.If(q.IsString(id), q.Ref(q.Collection(collectionOrRef), id), q.Ref(q.Collection(collectionOrRef))),
    );
    return {
      get() {
        const ctx = ContextExtend(contextExpr, 'factory.document.get');
        return q.If(
          offline,
          q.Let(
            {
              doc: q.Get(ref),
              // action: action(ctx)('get', q.Var('doc')).dispatch(),
            },
            q.Var('doc'),
          ),
          CallUDFunction('DocumentGet', contextExpr, { ref }),
        );
      },
      insert(data) {
        const ctx = ContextExtend(contextExpr, 'factory.document.insert');
        return q.If(
          offline,
          q.Let(
            {
              doc: q.Create(ref, { data }),
              action: action(ctx)('insert', q.Var('doc')).dispatch(),
            },
            q.Var('doc'),
          ),
          CallUDFunction('DocumentInsert', contextExpr, { ref, data }),
        );
      },
      update(data) {
        const ctx = ContextExtend(contextExpr, 'factory.document.update');
        return q.If(
          offline,
          q.Let(
            {
              doc: q.Update(ref, { data }),
              action: action(ctx)('update', q.Var('doc')).dispatch(),
            },
            q.Var('doc'),
          ),
          CallUDFunction('DocumentUpdate', contextExpr, { ref }),
        );
      },
      upsert(data) {
        const ctx = ContextExtend(contextExpr, 'factory.document.upsert');
        return q.If(
          offline,
          q.Let(
            {
              doc: q.If(q.Exists(ref), document(ctx)(ref).update(data), document(ctx)(ref).insert(data)),
              // already logging actions: update or insert
            },
            q.Var('doc'),
          ),
          CallUDFunction('DocumentUpsert', contextExpr, { ref }),
        );
      },
      replace(data) {
        const ctx = ContextExtend(contextExpr, 'factory.document.replace');
        return q.If(
          offline,
          q.Let(
            {
              doc: q.Replace(ref, data),
              action: action(ctx)('replace', q.Var('doc')).dispatch(),
            },
            q.Var('doc'),
          ),
          CallUDFunction('DocumentReplace', contextExpr, { ref }),
        );
      },
      repsert(data) {
        const ctx = ContextExtend(contextExpr, 'factory.document.repsert');
        return q.If(
          offline,
          q.Let(
            {
              doc: q.If(q.Exists(ref), document(ctx)(ref).replace(data), document(ctx)(ref).insert(data)),
              // already logging actions: replace or insert
            },
            q.Var('doc'),
          ),
          CallUDFunction('DocumentReplace', contextExpr, { ref }),
        );
      },
      delete() {
        const ctx = ContextExtend(contextExpr, 'factory.document.delete');
        return q.If(
          offline,
          q.Let(
            {
              doc: document(ctx)(ref).validity.delete(),
              action: action(ctx)('delete', q.Var('doc')).dispatch(),
            },
            q.Var('doc'),
          ),
          CallUDFunction('DocumentDelete', contextExpr, { ref }),
        );
      },
      restore() {
        const ctx = ContextExtend(contextExpr, 'factory.document.restore');
        return q.If(
          offline,
          q.Let(
            {
              doc: document(ctx)(ref).validity.restore(),
              // already logged
            },
            q.Var('doc'),
          ),
          CallUDFunction('DocumentRestore', contextExpr, { ref }),
        );
      },
      forget() {
        const ctx = ContextExtend(contextExpr, 'factory.document.forget');
        return q.If(
          offline,
          q.Let(
            {
              action: action(ctx)('forget', ref).dispatch(),
              doc: q.Delete(ref),
            },
            q.Var('doc'),
          ),
          CallUDFunction('DocumentRestore', contextExpr, { ref }),
        );
      },
      clean() {
        const ctx = ContextExtend(contextExpr, 'factory.document.clean');
        return q.If(
          offline,
          q.Let(
            {
              doc: q.If(q.Exists(ref), document(ctx)(ref).forget(), false),
              // already logging actions: forget
            },
            q.Var('doc'),
          ),
          CallUDFunction('DocumentClean', contextExpr, { ref }),
        );
      },
      expireAt(at) {
        const ctx = ContextExtend(contextExpr, 'factory.document.expireAt');
        return q.If(
          offline,
          q.Let(
            {
              doc: document(ctx)(ref).validity.expire(at),
              // already logged
            },
            q.Var('doc'),
          ),
          CallUDFunction('DocumentExpireAt', contextExpr, { ref, at }),
        );
      },
      expireIn(delay) {
        const ctx = ContextExtend(contextExpr, 'factory.document.expireIn');
        return q.If(
          offline,
          q.Let(
            {
              doc: document(ctx)(ref).validity.expire(q.TimeAdd(q.Now(), q.ToNumber(delay), 'milliseconds')),
              // already logged
            },
            q.Var('doc'),
          ),
          CallUDFunction('DocumentExpireIn', contextExpr, { ref, delay }),
        );
      },
      expireNow() {
        const ctx = ContextExtend(contextExpr, 'factory.document.expireIn');
        return q.If(
          offline,
          q.Let(
            {
              doc: document(ctx)(ref).validity.expire(q.Now()),
              // already logged
            },
            q.Var('doc'),
          ),
          CallUDFunction('DocumentExpireNow', contextExpr, { ref }),
        );
      },

      membership: {
        role(roleOrRef) {
          const roleRef = q.If(q.IsRole(roleOrRef), roleOrRef, q.Role(roleOrRef));
          return {
            distinct() {
              const ctx = ContextExtend(contextExpr, 'factory.document.membership.role.distinct');
              return q.If(
                offline,
                q.Let(
                  {
                    doc: q.Distinct(q.Union(q.Select(helpers.path('_membership.roles'), q.Get(ref), []), [roleRef])),
                    // nothing to log
                  },
                  q.Var('doc'),
                ),
                CallUDFunction('DocumentMembershipRoleDistinct', contextExpr, { ref, roleRef }),
              );
            },
            difference() {
              const ctx = ContextExtend(contextExpr, 'factory.document.membership.role.difference');
              return q.If(
                offline,
                q.Let(
                  {
                    doc: q.Difference(q.Select(helpers.path('_membership.roles'), q.Get(ref), []), [roleRef]),
                    // nothing to log
                  },
                  q.Var('doc'),
                ),
                CallUDFunction('DocumentMembershipRoleDifference', contextExpr, { ref, roleRef }),
              );
            },
            set() {
              const ctx = ContextExtend(contextExpr, 'factory.document.membership.role.set');
              return q.If(
                offline,
                q.Let(
                  {
                    doc: document(ctx)(ref).upsert({
                      _membership: {
                        roles: document(ctx)(ref).membership.role(roleRef).distinct(),
                      },
                    }),
                  },
                  q.Var('doc'),
                ),
                CallUDFunction('DocumentMembershipRoleSet', contextExpr, { ref, roleRef }),
              );
            },
            remove() {
              const ctx = ContextExtend(contextExpr, 'factory.document.membership.role.remove');
              return q.If(
                offline,
                q.Let(
                  {
                    doc: document(ctx)(ref).upsert({
                      _membership: {
                        roles: document(ctx)(ref).membership.role(roleRef).difference(),
                      },
                    }),
                  },
                  q.Var('doc'),
                ),
                CallUDFunction('DocumentMembershipRoleRemove', contextExpr, { ref, roleRef }),
              );
            },
          };
        },
        owner: {
          // tslint:disable-next-line: no-shadowed-variable
          set(user) {
            const ctx = ContextExtend(contextExpr, 'factory.document.membership.owner.set');
            return q.If(
              offline,
              q.Let(
                {
                  doc: q.If(
                    q.IsDoc(user),
                    document(ctx)(ref).upsert({
                      _membership: {
                        owner: user,
                      },
                    }),
                    ThrowError(ctx, "User isn't a document reference", { user }),
                  ),
                },
                q.Var('doc'),
              ),
              CallUDFunction('DocumentMembershipOwnerSet', contextExpr, { ref, user }),
            );
          },
          remove() {
            const ctx = ContextExtend(contextExpr, 'factory.document.membership.owner.remove');
            return q.If(
              offline,
              q.Let(
                {
                  doc: document(ctx)(ref).upsert({
                    _membership: {
                      owner: null,
                    },
                  }),
                },
                q.Var('doc'),
              ),
              CallUDFunction('DocumentMembershipOwnerRemove', contextExpr, { ref }),
            );
          },
        },
        assignee(assignee) {
          const assigneeRef = q.If(q.IsDoc(assignee), assignee, null);
          return {
            distinct() {
              const ctx = ContextExtend(contextExpr, 'factory.document.membership.assignee.distinct');
              return q.If(
                offline,
                q.Let(
                  {
                    doc: q.Distinct(q.Union(q.Select(helpers.path('_membership.assignees'), q.Get(ref), []), [assigneeRef])),
                    // don't need logging
                  },
                  q.Var('doc'),
                ),
                CallUDFunction('DocumentMembershipAssigneeDistinct', contextExpr, { ref, assigneeRef }),
              );
            },
            difference() {
              const ctx = ContextExtend(contextExpr, 'factory.document.membership.assignee.difference');
              return q.If(
                offline,
                q.Let(
                  {
                    doc: q.Difference(q.Select(helpers.path('_membership.assignees'), q.Get(ref), []), [assigneeRef]),
                    // don't need logging
                  },
                  q.Var('doc'),
                ),
                CallUDFunction('DocumentMembershipAssigneeDifference', contextExpr, { ref, assigneeRef }),
              );
            },
            set() {
              const ctx = ContextExtend(contextExpr, 'factory.document.membership.assignee.set');
              return q.If(
                offline,
                q.Let(
                  {
                    doc: document(ctx)(ref).upsert({
                      _membership: {
                        assignees: document(ctx)(ref).membership.role(assigneeRef).distinct(),
                      },
                    }),
                    // already logging actions: update/insert in upsert
                  },
                  q.Var('doc'),
                ),
                CallUDFunction('DocumentMembershipAssigneeSet', contextExpr, { ref, assigneeRef }),
              );
            },
            remove() {
              const ctx = ContextExtend(contextExpr, 'factory.document.membership.assignee.remove');
              return q.If(
                offline,
                q.Let(
                  {
                    doc: document(ctx)(ref).upsert({
                      _membership: {
                        assignees: document(ctx)(ref).membership.role(assigneeRef).difference(),
                      },
                    }),
                    // already logging actions: update/insert in upsert
                  },
                  q.Var('doc'),
                ),
                CallUDFunction('DocumentMembershipAssigneeRemove', contextExpr, { ref, assigneeRef }),
              );
            },
          };
        },
      },
      validity: {
        delete() {
          const ctx = ContextExtend(contextExpr, 'factory.document.validity.delete');
          return q.If(
            offline,
            q.Let(
              {
                doc: document(ctx)(ref).upsert({
                  _validity: {
                    deleted: true,
                  },
                }),
                // already logging actions: update/insert in upsert
              },
              q.Var('doc'),
            ),
            CallUDFunction('DocumentValidityDelete', contextExpr, { ref }),
          );
        },
        expire(at) {
          const ctx = ContextExtend(contextExpr, 'factory.document.validity.expire');
          return q.If(
            offline,
            q.Let(
              {
                doc: q.If(
                  q.IsTimestamp(at),
                  document(ctx)(ref).upsert({
                    _validity: {
                      expires_at: at,
                    },
                  }),
                  ThrowError(ctx, "[at] isn't a valid time", { at }),
                ),
                action: action(ctx)('expire', q.Var('doc')).dispatch(),
              },
              q.Var('doc'),
            ),
            CallUDFunction('DocumentValidityExpire', contextExpr, { ref, at }),
          );
        },
        restore() {
          const ctx = ContextExtend(contextExpr, 'factory.document.validity.restore');
          return q.If(
            offline,
            q.Let(
              {
                doc: q.Let(
                  {
                    doc: q.Get(ref),
                    isDeleted: q.Select(helpers.path('_validity.deleted'), q.Var('doc'), false),
                    isExpired: q.GTE(q.Select(helpers.path('_validity.expires_at'), q.Var('doc'), q.ToTime(TS_2500_YEARS)), q.Now()),
                  },
                  q.Do(
                    q.If(
                      q.Var('isDeleted'),
                      document(ctx)(ref).upsert({
                        _validity: {
                          deleted: false,
                        },
                      }),
                      false,
                    ),
                    q.If(
                      q.Var('isExpired'),
                      document(ctx)(ref).upsert({
                        _validity: {
                          expires_at: null,
                        },
                      }),
                      false,
                    ),
                  ),
                ),
                action: action(ctx)('restore', q.Var('doc')).dispatch(),
              },
              q.Var('doc'),
            ),
            CallUDFunction('DocumentValidityRestore', contextExpr, { ref }),
          );
        },
      },
    };
  };
};
