import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryDocument } from '~/../types/factory/factory.document';
import { TS_2500_YEARS } from '~/consts';
import { action } from '~/factory/api/action';
import * as helpers from '~/helpers';
import { ContextExtend, ContextProp } from '../constructors/context';
import { ThrowError } from '../constructors/error';
import { MethodDispatch, Query } from '../constructors/method';
import { ResultData } from '../constructors/result';
import { BiotaFunctionName } from '../constructors/udfunction';

// tslint:disable-next-line: only-arrow-functions
export const document: FactoryContext<FactoryDocument> = function (context): FactoryDocument {
  context = ContextExtend(context);

  // tslint:disable-next-line: only-arrow-functions
  return (collectionOrRef = null, id = null) => {
    const ref = q.If(
      q.Or(q.IsDoc(collectionOrRef), q.IsCollection(collectionOrRef)),
      collectionOrRef,
      q.If(q.IsString(id), q.Ref(q.Collection(collectionOrRef), id), q.Collection(collectionOrRef)),
    );
    return {
      get() {
        const inputs = { ref };
        // ----
        const query = Query(
          {
            doc: q.Get(q.Var('ref')),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.document.get';
        const online = { name: BiotaFunctionName('DocumentGet'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      insert(data) {
        const inputs = { ref, data };
        // ----
        const query = Query(
          {
            annotated: document(q.Var('ctx'))().annotate('insert', q.Var('data')),
            doc: q.Create(q.Var('ref'), { data: q.Var('annotated') }),
            action: action(q.Var('ctx'))('insert', q.Var('doc')).insert(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ----
        const offline = 'factory.document.insert';
        const online = { name: BiotaFunctionName('DocumentInsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      update(data) {
        const inputs = { ref, data };
        // ----
        const query = Query(
          {
            annotated: document(q.Var('ctx'))().annotate('update', q.Var('data')),
            doc: q.Update(q.Var('ref'), { data: q.Var('annotated') }),
            action: action(q.Var('ctx'))('update', q.Var('doc')).insert(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ----
        const offline = 'factory.document.update';
        const online = { name: BiotaFunctionName('DocumentUpdate'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      upsert(data) {
        const inputs = { ref, data };
        // ----
        const query = Query(
          {
            doc: q.If(
              q.Exists(q.Var('ref')),
              ResultData(document(q.Var('ctx'))(q.Var('ref')).update(q.Var('data'))),
              ResultData(document(q.Var('ctx'))(q.Var('ref')).insert(q.Var('data'))),
            ),
          },
          q.Var('doc'),
          // already logging actions: update or insert
        );
        // ----
        const offline = 'factory.document.upsert';
        const online = { name: BiotaFunctionName('DocumentUpsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      replace(data) {
        const inputs = { ref, data };
        // ----
        const query = Query(
          {
            current_doc: document(q.Var('ctx'))(q.Var('ref')).get(),
            annotated: document(q.Var('ctx'))().annotate(
              'replace',
              q.Merge(q.Var('data'), {
                _auth: q.Select('_auth', q.Var('current_doc'), {}),
                _membership: q.Select('_membership', q.Var('current_doc'), {}),
                _validity: q.Select('_validity', q.Var('current_doc'), {}),
                _activity: q.Select('_activity', q.Var('current_doc'), {}),
              }),
            ),
            doc: q.Replace(q.Var('ref'), { data: q.Var('annotated') }),
            action: action(q.Var('ctx'))('replace', q.Var('doc')).insert(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ----
        const offline = 'factory.document.replace';
        const online = { name: BiotaFunctionName('DocumentReplace'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      repsert(data) {
        const inputs = { ref, data };
        // ----
        const query = Query(
          {
            doc: q.If(
              q.Exists(q.Var('ref')),
              ResultData(document(q.Var('ctx'))(q.Var('ref')).replace(q.Var('data'))),
              ResultData(document(q.Var('ctx'))(q.Var('ref')).insert(q.Var('data'))),
            ),
          },
          q.Var('doc'),
          // already logging actions: replace or insert
        );
        // ----
        const offline = 'factory.document.repsert';
        const online = { name: BiotaFunctionName('DocumentRepsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      delete() {
        // alias
        const inputs = { ref };
        // ----
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).validity.delete()),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.document.delete';
        const online = { name: BiotaFunctionName('DocumentDelete'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      restore() {
        // alias
        const inputs = { ref };
        // ----
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).validity.restore()),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.document.restore';
        const online = { name: BiotaFunctionName('DocumentRestore'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      forget() {
        const inputs = { ref };
        // ----
        const query = Query(
          {
            annotated: document(q.Var('ctx'))().annotate('forget'),
            annotated_doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).upsert(q.Var('annotated'))),
            action: action(q.Var('ctx'))('forget', ref).insert(),
            doc: q.Delete(q.Var('ref')),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.document.forget';
        const online = { name: BiotaFunctionName('DocumentRestore'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      clean() {
        const inputs = { ref };
        // ----
        const query = Query(
          {
            doc: q.If(q.Exists(q.Var('ref')), document(q.Var('ctx'))(q.Var('ref')).forget(), false),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.document.clean';
        const online = { name: BiotaFunctionName('DocumentClean'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireAt(at) {
        // alias
        const inputs = { ref, at };
        // ----
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).validity.expire(q.Var('at'))),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.document.expireAt';
        const online = { name: BiotaFunctionName('DocumentExpireAt'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireIn(delay) {
        // alias
        const inputs = { ref, delay };
        // ----
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).validity.expire(q.TimeAdd(q.Now(), q.ToNumber(delay), 'milliseconds'))),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.document.expireIn';
        const online = { name: BiotaFunctionName('DocumentExpireIn'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireNow() {
        // alias
        const inputs = { ref };
        // ----
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).validity.expire(q.Now())),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.document.expireNow';
        const online = { name: BiotaFunctionName('DocumentExpireNow'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },

      membership: {
        role(roleOrRef) {
          const roleRef = q.If(q.IsRole(roleOrRef), roleOrRef, q.Role(roleOrRef));
          return {
            distinct() {
              const inputs = { ref, roleRef };
              // ----
              const query = Query(
                {
                  doc: q.Distinct(q.Union(q.Select(helpers.path('_membership.roles'), q.Get(q.Var('ref')), []), [q.Var('roleRef')])),
                },
                q.Var('doc'),
              );
              // ----
              const offline = 'factory.document.membership.role.distinct';
              const online = { name: BiotaFunctionName('DocumentMembershipRoleDistinct'), role: null };
              return MethodDispatch({ context, inputs, query })(offline, online);
            },
            difference() {
              const inputs = { ref, roleRef };
              // ----
              const query = Query(
                {
                  doc: q.Difference(q.Select(helpers.path('_membership.roles'), q.Get(q.Var('ref')), []), [q.Var('roleRef')]),
                },
                q.Var('doc'),
              );
              // ----
              const offline = 'factory.document.membership.role.difference';
              const online = { name: BiotaFunctionName('DocumentMembershipRoleDifference'), role: null };
              return MethodDispatch({ context, inputs, query })(offline, online);
            },
            set() {
              const inputs = { ref, roleRef };
              // ----
              const query = Query(
                {
                  annotated: document(q.Var('ctx'))().annotate('roles_change', {
                    _membership: {
                      roles: ResultData(document(q.Var('ctx'))(q.Var('ref')).membership.role(q.Var('roleRef')).distinct()),
                    },
                  }),
                  doc: document(q.Var('ctx'))(q.Var('ref')).upsert(q.Var('annotated')),
                  action: action(q.Var('ctx'))('roles_change', ref).insert(),
                },
                q.Var('doc'),
                q.Var('action'),
              );
              // ----
              const offline = 'factory.document.membership.role.set';
              const online = { name: BiotaFunctionName('DocumentMembershipRoleSet'), role: null };
              return MethodDispatch({ context, inputs, query })(offline, online);
            },
            remove() {
              const inputs = { ref, roleRef };
              // ----
              const query = Query(
                {
                  annotated: document(q.Var('ctx'))().annotate('roles_change', {
                    _membership: {
                      roles: ResultData(document(q.Var('ctx'))(q.Var('ref')).membership.role(q.Var('roleRef')).difference()),
                    },
                  }),
                  doc: document(q.Var('ctx'))(q.Var('ref')).upsert(q.Var('annotated')),
                  action: action(q.Var('ctx'))('roles_change', ref).insert(),
                },
                q.Var('doc'),
                q.Var('action'),
              );
              // ----
              const offline = 'factory.document.membership.role.remove';
              const online = { name: BiotaFunctionName('DocumentMembershipRoleRemove'), role: null };
              return MethodDispatch({ context, inputs, query })(offline, online);
            },
          };
        },
        owner: {
          // tslint:disable-next-line: no-shadowed-variable
          set(user) {
            const inputs = { ref, user };
            // ----
            const query = Query(
              {
                annotated: document(q.Var('ctx'))().annotate('owner_change', {
                  _membership: {
                    owner: q.Var('user'),
                  },
                }),
                doc: q.If(
                  q.IsDoc(q.Var('user')),
                  ResultData(document(q.Var('ctx'))(q.Var('ref')).upsert(q.Var('annotated'))),
                  ThrowError(q.Var('ctx'), "User isn't a document reference", { user: q.Var('user') }),
                ),
                action: action(q.Var('ctx'))('owner_change', ref).insert(),
              },
              q.Var('doc'),
              q.Var('action'),
            );
            // ----
            const offline = 'factory.document.membership.owner.set';
            const online = { name: BiotaFunctionName('DocumentMembershipOwnerSet'), role: null };
            return MethodDispatch({ context, inputs, query })(offline, online);
          },
          remove() {
            const inputs = { ref };
            // ----
            const query = Query(
              {
                annotated: document(q.Var('ctx'))().annotate('owner_change', {
                  _membership: {
                    owner: null,
                  },
                }),
                doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).upsert(q.Var('annotated'))),
                action: action(q.Var('ctx'))('owner_change', ref).insert(),
              },
              q.Var('doc'),
              q.Var('action'),
            );
            // ----
            const offline = 'factory.document.membership.owner.remove';
            const online = { name: BiotaFunctionName('DocumentMembershipOwnerRemove'), role: null };
            return MethodDispatch({ context, inputs, query })(offline, online);
          },
        },
        assignee(assignee) {
          const assigneeRef = q.If(q.IsDoc(assignee), assignee, null);
          return {
            distinct() {
              const inputs = { ref, assigneeRef };
              // ----
              const query = Query(
                {
                  doc: q.Distinct(
                    q.Union(q.Select(helpers.path('_membership.assignees'), q.Get(q.Var('ref')), []), [q.Var('assigneeRef')]),
                  ),
                },
                q.Var('doc'),
              );
              // ----
              const offline = 'factory.document.membership.assignee.distinct';
              const online = { name: BiotaFunctionName('DocumentMembershipAssigneeDistinct'), role: null };
              return MethodDispatch({ context, inputs, query })(offline, online);
            },
            difference() {
              const inputs = { ref, assigneeRef };
              // ----
              const query = Query(
                {
                  doc: q.Difference(q.Select(helpers.path('_membership.assignees'), q.Get(q.Var('ref')), []), [q.Var('assigneeRef')]),
                },
                q.Var('doc'),
              );
              // ----
              const offline = 'factory.document.membership.assignee.difference';
              const online = { name: BiotaFunctionName('DocumentMembershipAssigneeDifference'), role: null };
              return MethodDispatch({ context, inputs, query })(offline, online);
            },
            set() {
              const inputs = { ref, assigneeRef };
              // ----
              const query = Query(
                {
                  annotated: document(q.Var('ctx'))().annotate('assignees_change', {
                    _membership: {
                      assignees: ResultData(document(q.Var('ctx'))(q.Var('ref')).membership.role(q.Var('assigneeRef')).distinct()),
                    },
                  }),
                  doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).upsert(q.Var('annotated'))),
                  action: action(q.Var('ctx'))('assignees_change', ref).insert(),
                },
                q.Var('doc'),
                q.Var('action'),
              );
              // ----
              const offline = 'factory.document.membership.assignee.set';
              const online = { name: BiotaFunctionName('DocumentMembershipAssigneeSet'), role: null };
              return MethodDispatch({ context, inputs, query })(offline, online);
            },
            remove() {
              const inputs = { ref, assigneeRef };
              // ----
              const query = Query(
                {
                  annotated: document(q.Var('ctx'))().annotate('assignees_change', {
                    _membership: {
                      assignees: ResultData(document(q.Var('ctx'))(q.Var('ref')).membership.role(q.Var('assigneeRef')).difference()),
                    },
                  }),
                  doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).upsert(q.Var('annotated'))),
                  action: action(q.Var('ctx'))('assignees_change', ref).insert(),
                },
                q.Var('doc'),
                q.Var('action'),
              );
              // ----
              const offline = 'factory.document.membership.assignee.remove';
              const online = { name: BiotaFunctionName('DocumentMembershipAssigneeRemove'), role: null };
              return MethodDispatch({ context, inputs, query })(offline, online);
            },
          };
        },
      },
      validity: {
        delete() {
          const inputs = { ref };
          // ----
          const query = Query(
            {
              annotated: document(q.Var('ctx'))().annotate('delete', {
                _validity: {
                  deleted: true,
                },
              }),
              doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).upsert(q.Var('annotated'))),
              action: action(q.Var('ctx'))('delete', q.Var('doc')).insert(),
            },
            q.Var('doc'),
            q.Var('action'),
          );
          // ----
          const offline = 'factory.document.validity.delete';
          const online = { name: BiotaFunctionName('DocumentValidityDelete'), role: null };
          return MethodDispatch({ context, inputs, query })(offline, online);
        },
        expire(at) {
          const inputs = { ref, at };
          // ----
          const query = Query(
            {
              annotated: document(q.Var('ctx'))().annotate('expire', {
                _validity: {
                  expires_at: q.Var('at'),
                },
              }),
              doc: q.If(
                q.IsTimestamp(q.Var('ctx')),
                ResultData(document(q.Var('ctx'))(q.Var('ref')).upsert(q.Var('annotated'))),
                ThrowError(q.Var('ctx'), "[at] isn't a valid time", { at: q.Var('ctx') }),
              ),
              action: action(q.Var('ctx'))('expire', q.Var('doc')).insert(),
            },
            q.Var('doc'),
            q.Var('action'),
          );
          // ----
          const offline = 'factory.document.validity.expire';
          const online = { name: BiotaFunctionName('DocumentValidityExpire'), role: null };
          return MethodDispatch({ context, inputs, query })(offline, online);
        },
        restore() {
          const inputs = { ref };
          // ----
          const query = Query(
            {
              doc: q.Let(
                {
                  current_doc: q.Get(q.Var('ref')),
                  isDeleted: q.Select(helpers.path('_validity.deleted'), q.Var('current_doc'), false),
                  isExpired: q.GTE(q.Select(helpers.path('_validity.expires_at'), q.Var('current_doc'), q.ToTime(TS_2500_YEARS)), q.Now()),
                },
                q.Let(
                  {
                    annotated: document(q.Var('ctx'))().annotate('restore', {
                      _validity: {
                        deleted: false,
                        expires_at: null,
                      },
                    }),
                    doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).upsert(q.Var('annotated'))),
                  },
                  q.Var('doc'),
                ),
              ),
              action: action(q.Var('ctx'))('restore', q.Var('doc')).insert(),
            },
            q.Var('doc'),
            q.Var('action'),
          );
          // ----
          const offline = 'factory.document.validity.restore';
          const online = { name: BiotaFunctionName('DocumentValidityRestore'), role: null };
          return MethodDispatch({ context, inputs, query })(offline, online);
        },
      },
      annotate(actionName = null, data = {}) {
        const ctx = ContextExtend(context, 'factory.document.annotate');
        return q.If(
          ContextProp(ctx, 'annotateDocuments'),
          q.Let(
            {
              activity: {
                insert: { inserted_by: ContextProp(ctx, 'identity'), inserted_at: q.Now() },
                update: { updated_by: ContextProp(ctx, 'identity'), updated_at: q.Now() },
                replace: { replaced_by: ContextProp(ctx, 'identity'), replaced_at: q.Now() },
                delete: { deleted_by: ContextProp(ctx, 'identity'), deleted_at: q.Now() },
                forget: { forgotten_by: ContextProp(ctx, 'identity'), forgotten_at: q.Now() },
                restore: { restored_by: ContextProp(ctx, 'identity'), restored_at: q.Now() },
                expire: { expiration_changed_by: ContextProp(ctx, 'identity'), expiration_changed_at: q.Now() },
                credentials_change: { credentials_changed_by: ContextProp(ctx, 'identity'), credentials_changed_at: q.Now() },
                auth_email_change: { auth_email_changed_by: ContextProp(ctx, 'identity'), auth_email_changed_at: q.Now() },
                auth_accounts_change: { auth_accounts_changed_by: ContextProp(ctx, 'identity'), auth_accounts_changed_at: q.Now() },
                roles_change: { roles_changed_by: ContextProp(ctx, 'identity'), roles_changed_at: q.Now() },
                owner_change: { owner_changed_by: ContextProp(ctx, 'identity'), owner_changed_at: q.Now() },
                assignees_change: { assignees_changed_by: ContextProp(ctx, 'identity'), assignees_changed_at: q.Now() },
              },
              _activity: q.Select(actionName, q.Var("activity"), null),
            },
            q.If(
              q.IsObject(q.Var('_activity')),
              q.Merge(data, { _activity: q.Var('_activity') }),
              ThrowError(ctx, "This action event doesn't exist", { name: actionName }),
            ),
          ),
          data,
        );
      },
    };
  };
};
