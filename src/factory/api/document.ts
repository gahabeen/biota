import { Expr, query as q } from 'faunadb';
import { TS_2500_YEARS } from '~/consts';
import { action } from '~/factory/api/action';
import { ContextNoLogNoAnnotation, ContextProp } from '~/factory/constructors/context';
import { ThrowError } from '~/factory/constructors/error';
import { MethodDispatch, MethodQuery } from '~/factory/constructors/method';
import { ResultAction, ResultData } from '~/factory/constructors/result';
import { BiotaFunctionName } from '~/factory/constructors/udfunction';
import * as helpers from '~/helpers';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryDocument } from '~/types/factory/factory.document';
import { Pagination } from '../constructors/pagination';
import { DocumentRef } from './constructors';

// tslint:disable-next-line: only-arrow-functions
export const document: FactoryContext<FactoryDocument> = function (context, options): FactoryDocument {
  const { prefix = 'Document' } = options || {};
  // tslint:disable-next-line: only-arrow-functions
  return (collection = null, id = null) => {
    const refExists = (collectionExpr: Expr, idExpr: Expr) => {
      return q.If(
        q.Not(q.Exists(q.Ref(q.Collection(collectionExpr), idExpr))),
        ThrowError(q.Var('ctx'), "Reference doesn't exists", { collection: collectionExpr, id: idExpr }),
        true,
      );
    };

    return {
      history(pagination = {}) {
        const inputs = { collection, id, pagination };
        // ----
        const query = MethodQuery(
          {
            refExists: refExists(q.Var('collection'), q.Var('id')),
            doc: q.Paginate(q.Events(q.Ref(q.Collection(q.Var('collection')), q.Var('id'))), Pagination(q.Var('pagination'))),
          },
          q.Var('doc'),
        );
        // ----
        const offline = `factory.${prefix.toLowerCase()}.history`;
        const online = { name: BiotaFunctionName(`${prefix}History`), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      get() {
        const inputs = { collection, id };
        // ----
        const query = MethodQuery(
          {
            ref: q.Ref(q.Collection(q.Var('collection')), q.Var('id')),
            refExists: refExists(q.Var('collection'), q.Var('id')),
            check: q.If(q.Not(q.Exists(q.Var('ref'))), ThrowError(q.Var('ctx'), "Reference doesn't exists", { ref: q.Var('ref') }), true),
            doc: q.Get(q.Var('ref')),
          },
          q.Var('doc'),
        );
        // ----
        const offline = `factory.${prefix.toLowerCase()}.get`;
        const online = { name: BiotaFunctionName(`${prefix}Get`), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      insert(data) {
        const inputs = { collection, id, data };
        // ----
        const query = MethodQuery(
          {
            ref: q.If(
              q.Not(q.IsNull(q.Var('id'))),
              q.Ref(q.Collection(q.Var('collection')), q.Var('id')),
              q.Collection(q.Var('collection')),
            ),
            annotated: ResultData(document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).annotate('insert', q.Var('data'))),
            doc: q.Create(q.Var('ref'), { data: q.Var('annotated') }),
            action: action(q.Var('ctx'))().log('insert', DocumentRef(q.Var('doc'))),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ----
        const offline = `factory.${prefix.toLowerCase()}.insert`;
        const online = { name: BiotaFunctionName(`${prefix}Insert`), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      update(data) {
        const inputs = { collection, id, data };
        // ----
        const query = MethodQuery(
          {
            refExists: refExists(q.Var('collection'), q.Var('id')),
            annotated: ResultData(document(q.Var('ctx'))().annotate('update', q.Var('data'))),
            doc: q.Update(q.Ref(q.Collection(q.Var('collection')), q.Var('id')), { data: q.Var('annotated') }),
            action: action(q.Var('ctx'))().log('update', DocumentRef(q.Var('doc'))),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ----
        const offline = `factory.${prefix.toLowerCase()}.update`;
        const online = { name: BiotaFunctionName(`${prefix}Update`), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      upsert(data) {
        const inputs = { collection, id, data };
        // ----
        const query = MethodQuery(
          {
            refExists: refExists(q.Var('collection'), q.Var('id')),
            doc: q.If(
              q.Exists(q.Ref(q.Collection(q.Var('collection')), q.Var('id'))),
              document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).update(q.Var('data')),
              document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).insert(q.Var('data')),
            ),
          },
          ResultData(q.Var('doc')),
          ResultAction(q.Var('doc')),
        );
        // ----
        const offline = `factory.${prefix.toLowerCase()}.upsert`;
        const online = { name: BiotaFunctionName(`${prefix}Upsert`), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      replace(data) {
        const inputs = { collection, id, data };
        // ----
        const query = MethodQuery(
          {
            refExists: refExists(q.Var('collection'), q.Var('id')),
            current_doc: ResultData(document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).get()),
            annotated: ResultData(
              document(q.Var('ctx'))().annotate(
                'replace',
                q.Merge(q.Var('data'), {
                  _auth: q.Select('_auth', q.Var('current_doc'), {}),
                  _membership: q.Select('_membership', q.Var('current_doc'), {}),
                  _validity: q.Select('_validity', q.Var('current_doc'), {}),
                  _activity: q.Select('_activity', q.Var('current_doc'), {}),
                }),
              ),
            ),
            doc: q.Replace(q.Ref(q.Collection(q.Var('collection')), q.Var('id')), { data: q.Var('annotated') }),
            action: action(q.Var('ctx'))().log('replace', DocumentRef(q.Var('doc'))),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ----
        const offline = `factory.${prefix.toLowerCase()}.replace`;
        const online = { name: BiotaFunctionName(`${prefix}Replace`), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      repsert(data) {
        const inputs = { collection, id, data };
        // ----
        const query = MethodQuery(
          {
            ref: q.Ref(q.Collection(q.Var('collection')), q.Var('id')),
            refExists: refExists(q.Var('collection'), q.Var('id')),
            doc: q.If(
              q.Exists(q.Var('ref')),
              document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).replace(q.Var('data')),
              document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).insert(q.Var('data')),
            ),
          },
          ResultData(q.Var('doc')),
          ResultAction(q.Var('doc')),
        );
        // ----
        const offline = `factory.${prefix.toLowerCase()}.repsert`;
        const online = { name: BiotaFunctionName(`${prefix}Repsert`), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      delete() {
        // alias
        const inputs = { collection, id };
        // ----
        const query = MethodQuery(
          {
            refExists: refExists(q.Var('collection'), q.Var('id')),
            doc: ResultData(document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).validity.delete()),
          },
          q.Var('doc'),
        );
        // ----
        const offline = `factory.${prefix.toLowerCase()}.delete`;
        const online = { name: BiotaFunctionName(`${prefix}Delete`), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      restore() {
        // alias
        const inputs = { collection, id };
        // ----
        const query = MethodQuery(
          {
            refExists: refExists(q.Var('collection'), q.Var('id')),
            doc: ResultData(document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).validity.restore()),
          },
          q.Var('doc'),
        );
        // ----
        const offline = `factory.${prefix.toLowerCase()}.restore`;
        const online = { name: BiotaFunctionName(`${prefix}Restore`), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      forget() {
        const inputs = { collection, id };
        // ----
        const query = MethodQuery(
          {
            ref: q.Ref(q.Collection(q.Var('collection')), q.Var('id')),
            refExists: refExists(q.Var('collection'), q.Var('id')),
            annotated: ResultData(document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).annotate('forget')),
            annotated_doc: ResultData(document(ContextNoLogNoAnnotation(q.Var('ctx')))(q.Var('ref')).upsert(q.Var('annotated'))),
            action: action(q.Var('ctx'))().log('forget', q.Var('ref')),
            doc: q.Delete(q.Var('ref')),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ----
        const offline = `factory.${prefix.toLowerCase()}.forget`;
        const online = { name: BiotaFunctionName(`${prefix}Restore`), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      remember() {
        const inputs = { collection, id };
        // ----
        const query = MethodQuery(
          {
            ref: q.Ref(q.Collection(q.Var('collection')), q.Var('id')),
            lastEvents: q.Select('data', q.Paginate(q.Events(q.Var('ref')), { size: 1, events: true, before: null }), []),
            deleteEvent: q.Select(0, q.Var('lastEvents'), null),
            isDeleteEvent: q.Equals(q.Select('action', q.Var('deleteEvent'), null), 'delete'),
            checkDeleteEvent: q.If(
              q.Var('isDeleteEvent'),
              true,
              ThrowError(q.Var('ctx'), "Reference hasn't been deleted", { ref: q.Var('ref') }),
            ),
            previousState: q.Get(q.Var('ref'), q.Subtract(q.Select('ts', q.Var('deleteEvent'), 0), 1)),
            annotated: ResultData(
              document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).annotate('remember', q.Select('data', q.Var('previousState'), {})),
            ),
            doc: q.Insert(q.Var('ref'), q.Now(), 'update', { data: q.Var('annotated') }),
            action: action(q.Var('ctx'))().log('remember', q.Var('ref')),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ----
        const offline = `factory.${prefix.toLowerCase()}.remember`;
        const online = { name: BiotaFunctionName(`${prefix}Remember`), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      drop() {
        const inputs = { collection, id };
        // ----
        const query = MethodQuery(
          {
            refExists: refExists(q.Var('collection'), q.Var('id')),
            doc: q.If(
              q.Exists(q.Ref(q.Collection(q.Var('collection')), q.Var('id'))),
              document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).forget(),
              {},
            ),
          },
          ResultData(q.Var('doc')),
          ResultAction(q.Var('doc')),
        );
        // ----
        const offline = `factory.${prefix.toLowerCase()}.drop`;
        const online = { name: BiotaFunctionName(`${prefix}Clean`), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireAt(at) {
        // alias
        const inputs = { collection, id, at };
        // ----
        const query = MethodQuery(
          {
            refExists: refExists(q.Var('collection'), q.Var('id')),
            doc: ResultData(document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).validity.expire(q.Var('at'))),
          },
          q.Var('doc'),
        );
        // ----
        const offline = `factory.${prefix.toLowerCase()}.expireAt`;
        const online = { name: BiotaFunctionName(`${prefix}ExpireAt`), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireIn(delay) {
        // alias
        const inputs = { collection, id, delay };
        // ----
        const query = MethodQuery(
          {
            refExists: refExists(q.Var('collection'), q.Var('id')),
            doc: ResultData(
              document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).validity.expire(
                q.TimeAdd(q.Now(), q.ToNumber(q.Var('delay')), 'milliseconds'),
              ),
            ),
          },
          q.Var('doc'),
        );
        // ----
        const offline = `factory.${prefix.toLowerCase()}.expireIn`;
        const online = { name: BiotaFunctionName(`${prefix}ExpireIn`), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireNow() {
        // alias
        const inputs = { collection, id };
        // ----
        const query = MethodQuery(
          {
            refExists: refExists(q.Var('collection'), q.Var('id')),
            doc: ResultData(document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).validity.expire(q.Now())),
          },
          q.Var('doc'),
        );
        // ----
        const offline = `factory.${prefix.toLowerCase()}.expireNow`;
        const online = { name: BiotaFunctionName(`${prefix}ExpireNow`), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      membership: {
        role(roleOrRef) {
          const roleRef = q.If(q.IsRole(roleOrRef), roleOrRef, q.Role(roleOrRef));
          return {
            distinct() {
              const inputs = { collection, id, roleRef };
              // ----
              const query = MethodQuery(
                {
                  refExists: refExists(q.Var('collection'), q.Var('id')),
                  doc: q.Distinct(
                    q.Union(q.Select(helpers.path('_membership.roles'), q.Get(q.Ref(q.Collection(q.Var('collection')), q.Var('id'))), []), [
                      q.Var('roleRef'),
                    ]),
                  ),
                },
                q.Var('doc'),
              );
              // ----
              const offline = `factory.${prefix.toLowerCase()}.membership.role.distinct`;
              const online = { name: BiotaFunctionName(`${prefix}MembershipRoleDistinct`), role: null };
              return MethodDispatch({ context, inputs, query })(offline, online);
            },
            difference() {
              const inputs = { collection, id, roleRef };
              // ----
              const query = MethodQuery(
                {
                  refExists: refExists(q.Var('collection'), q.Var('id')),
                  doc: q.Difference(
                    q.Select(helpers.path('_membership.roles'), q.Get(q.Ref(q.Collection(q.Var('collection')), q.Var('id'))), []),
                    [q.Var('roleRef')],
                  ),
                },
                q.Var('doc'),
              );
              // ----
              const offline = `factory.${prefix.toLowerCase()}.membership.role.difference`;
              const online = { name: BiotaFunctionName(`${prefix}MembershipRoleDifference`), role: null };
              return MethodDispatch({ context, inputs, query })(offline, online);
            },
            set() {
              const inputs = { collection, id, roleRef };
              // ----
              const query = MethodQuery(
                {
                  refExists: refExists(q.Var('collection'), q.Var('id')),
                  annotated: ResultData(
                    document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).annotate('roles_change', {
                      _membership: {
                        roles: ResultData(
                          document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).membership.role(q.Var('roleRef')).distinct(),
                        ),
                      },
                    }),
                  ),
                  doc: ResultData(
                    document(ContextNoLogNoAnnotation(q.Var('ctx')))(q.Var('collection'), q.Var('id')).upsert(q.Var('annotated')),
                  ),
                  action: action(q.Var('ctx'))().log('roles_change', DocumentRef(q.Var('doc'))),
                },
                q.Var('doc'),
                q.Var('action'),
              );
              // ----
              const offline = `factory.${prefix.toLowerCase()}.membership.role.set`;
              const online = { name: BiotaFunctionName(`${prefix}MembershipRoleSet`), role: null };
              return MethodDispatch({ context, inputs, query })(offline, online);
            },
            remove() {
              const inputs = { collection, id, roleRef };
              // ----
              const query = MethodQuery(
                {
                  refExists: refExists(q.Var('collection'), q.Var('id')),
                  annotated: ResultData(
                    document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).annotate('roles_change', {
                      _membership: {
                        roles: ResultData(
                          document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).membership.role(q.Var('roleRef')).difference(),
                        ),
                      },
                    }),
                  ),
                  doc: ResultData(
                    document(ContextNoLogNoAnnotation(q.Var('ctx')))(q.Var('collection'), q.Var('id')).upsert(q.Var('annotated')),
                  ),
                  action: action(q.Var('ctx'))().log('roles_change', DocumentRef(q.Var('doc'))),
                },
                q.Var('doc'),
                q.Var('action'),
              );
              // ----
              const offline = `factory.${prefix.toLowerCase()}.membership.role.remove`;
              const online = { name: BiotaFunctionName(`${prefix}MembershipRoleRemove`), role: null };
              return MethodDispatch({ context, inputs, query })(offline, online);
            },
          };
        },
        owner: {
          // tslint:disable-next-line: no-shadowed-variable
          set(user) {
            const inputs = { collection, id, user };
            // ----
            const query = MethodQuery(
              {
                refExists: refExists(q.Var('collection'), q.Var('id')),
                annotated: ResultData(
                  document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).annotate('owner_change', {
                    _membership: {
                      owner: q.Var('user'),
                    },
                  }),
                ),
                doc: q.If(
                  q.IsDoc(q.Var('user')),
                  ResultData(document(ContextNoLogNoAnnotation(q.Var('ctx')))(q.Var('collection'), q.Var('id')).upsert(q.Var('annotated'))),
                  ThrowError(q.Var('ctx'), "User isn't a document reference", { user: q.Var('user') }),
                ),
                action: action(q.Var('ctx'))().log('owner_change', DocumentRef(q.Var('doc'))),
              },
              q.Var('doc'),
              q.Var('action'),
            );
            // ----
            const offline = `factory.${prefix.toLowerCase()}.membership.owner.set`;
            const online = { name: BiotaFunctionName(`${prefix}MembershipOwnerSet`), role: null };
            return MethodDispatch({ context, inputs, query })(offline, online);
          },
          remove() {
            const inputs = { collection, id };
            // ----
            const query = MethodQuery(
              {
                refExists: refExists(q.Var('collection'), q.Var('id')),
                annotated: ResultData(
                  document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).annotate('owner_change', {
                    _membership: {
                      owner: null,
                    },
                  }),
                ),
                doc: ResultData(
                  document(ContextNoLogNoAnnotation(q.Var('ctx')))(q.Var('collection'), q.Var('id')).upsert(q.Var('annotated')),
                ),
                action: action(q.Var('ctx'))().log('owner_change', DocumentRef(q.Var('doc'))),
              },
              q.Var('doc'),
              q.Var('action'),
            );
            // ----
            const offline = `factory.${prefix.toLowerCase()}.membership.owner.remove`;
            const online = { name: BiotaFunctionName(`${prefix}MembershipOwnerRemove`), role: null };
            return MethodDispatch({ context, inputs, query })(offline, online);
          },
        },
        assignee(assignee) {
          const assigneeRef = q.If(q.IsDoc(assignee), assignee, null);
          return {
            distinct() {
              const inputs = { collection, id, assigneeRef };
              // ----
              const query = MethodQuery(
                {
                  refExists: refExists(q.Var('collection'), q.Var('id')),
                  doc: q.Distinct(
                    q.Union(
                      q.Select(helpers.path('_membership.assignees'), q.Get(q.Ref(q.Collection(q.Var('collection')), q.Var('id'))), []),
                      [q.Var('assigneeRef')],
                    ),
                  ),
                },
                q.Var('doc'),
              );
              // ----
              const offline = `factory.${prefix.toLowerCase()}.membership.assignee.distinct`;
              const online = { name: BiotaFunctionName(`${prefix}MembershipAssigneeDistinct`), role: null };
              return MethodDispatch({ context, inputs, query })(offline, online);
            },
            difference() {
              const inputs = { collection, id, assigneeRef };
              // ----
              const query = MethodQuery(
                {
                  refExists: refExists(q.Var('collection'), q.Var('id')),
                  doc: q.Difference(
                    q.Select(helpers.path('_membership.assignees'), q.Get(q.Ref(q.Collection(q.Var('collection')), q.Var('id'))), []),
                    [q.Var('assigneeRef')],
                  ),
                },
                q.Var('doc'),
              );
              // ----
              const offline = `factory.${prefix.toLowerCase()}.membership.assignee.difference`;
              const online = { name: BiotaFunctionName(`${prefix}MembershipAssigneeDifference`), role: null };
              return MethodDispatch({ context, inputs, query })(offline, online);
            },
            set() {
              const inputs = { collection, id, assigneeRef };
              // ----
              const query = MethodQuery(
                {
                  refExists: refExists(q.Var('collection'), q.Var('id')),
                  annotated: ResultData(
                    document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).annotate('assignees_change', {
                      _membership: {
                        assignees: ResultData(
                          document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).membership.role(q.Var('assigneeRef')).distinct(),
                        ),
                      },
                    }),
                  ),
                  doc: ResultData(
                    document(ContextNoLogNoAnnotation(q.Var('ctx')))(q.Var('collection'), q.Var('id')).upsert(q.Var('annotated')),
                  ),
                  action: action(q.Var('ctx'))().log('assignees_change', DocumentRef(q.Var('doc'))),
                },
                q.Var('doc'),
                q.Var('action'),
              );
              // ----
              const offline = `factory.${prefix.toLowerCase()}.membership.assignee.set`;
              const online = { name: BiotaFunctionName(`${prefix}MembershipAssigneeSet`), role: null };
              return MethodDispatch({ context, inputs, query })(offline, online);
            },
            remove() {
              const inputs = { collection, id, assigneeRef };
              // ----
              const query = MethodQuery(
                {
                  refExists: refExists(q.Var('collection'), q.Var('id')),
                  annotated: ResultData(
                    document(q.Var('ctx'))().annotate('assignees_change', {
                      _membership: {
                        assignees: ResultData(
                          document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).membership.role(q.Var('assigneeRef')).difference(),
                        ),
                      },
                    }),
                  ),
                  doc: ResultData(
                    document(ContextNoLogNoAnnotation(q.Var('ctx')))(q.Var('collection'), q.Var('id')).upsert(q.Var('annotated')),
                  ),
                  action: action(q.Var('ctx'))().log('assignees_change', DocumentRef(q.Var('doc'))),
                },
                q.Var('doc'),
                q.Var('action'),
              );
              // ----
              const offline = `factory.${prefix.toLowerCase()}.membership.assignee.remove`;
              const online = { name: BiotaFunctionName(`${prefix}MembershipAssigneeRemove`), role: null };
              return MethodDispatch({ context, inputs, query })(offline, online);
            },
          };
        },
      },
      validity: {
        delete() {
          const inputs = { collection, id };
          // ----
          const query = MethodQuery(
            {
              refExists: refExists(q.Var('collection'), q.Var('id')),
              annotated: ResultData(
                document(q.Var('ctx'))().annotate('delete', {
                  _validity: {
                    deleted: true,
                  },
                }),
              ),
              doc: ResultData(
                document(ContextNoLogNoAnnotation(q.Var('ctx')))(q.Var('collection'), q.Var('id')).upsert(q.Var('annotated')),
              ),
              action: action(q.Var('ctx'))().log('delete', DocumentRef(q.Var('doc'))),
            },
            q.Var('doc'),
            q.Var('action'),
          );
          // ----
          const offline = `factory.${prefix.toLowerCase()}.validity.delete`;
          const online = { name: BiotaFunctionName(`${prefix}ValidityDelete`), role: null };
          return MethodDispatch({ context, inputs, query })(offline, online);
        },
        expire(at) {
          const inputs = { collection, id, at };
          // ----
          const query = MethodQuery(
            {
              refExists: refExists(q.Var('collection'), q.Var('id')),
              annotated: ResultData(
                document(q.Var('ctx'))().annotate('expire', {
                  _validity: {
                    expires_at: q.Var('at'),
                  },
                }),
              ),
              doc: q.If(
                q.IsTimestamp(q.Var('at')),
                ResultData(document(ContextNoLogNoAnnotation(q.Var('ctx')))(q.Var('collection'), q.Var('id')).upsert(q.Var('annotated'))),
                ThrowError(q.Var('ctx'), "[at] isn't a valid time", { at: q.Var('at') }),
              ),
              action: action(q.Var('ctx'))().log('expire', DocumentRef(q.Var('doc'))),
            },
            q.Var('doc'),
            q.Var('action'),
          );
          // ----
          const offline = `factory.${prefix.toLowerCase()}.validity.expire`;
          const online = { name: BiotaFunctionName(`${prefix}ValidityExpire`), role: null };
          return MethodDispatch({ context, inputs, query })(offline, online);
        },
        restore() {
          const inputs = { collection, id };
          // ----
          const query = MethodQuery(
            {
              refExists: refExists(q.Var('collection'), q.Var('id')),
              doc: q.Let(
                {
                  current_doc: q.Get(q.Ref(q.Collection(q.Var('collection')), q.Var('id'))),
                  isDeleted: q.Select(helpers.path('_validity.deleted'), q.Var('current_doc'), false),
                  isExpired: q.GTE(q.Select(helpers.path('_validity.expires_at'), q.Var('current_doc'), q.ToTime(TS_2500_YEARS)), q.Now()),
                },
                q.Let(
                  {
                    annotated: ResultData(
                      document(q.Var('ctx'))(q.Var('collection'), q.Var('id')).annotate('restore', {
                        _validity: {
                          deleted: false,
                          expires_at: null,
                        },
                      }),
                    ),
                    doc: ResultData(
                      document(ContextNoLogNoAnnotation(q.Var('ctx')))(q.Var('collection'), q.Var('id')).upsert(q.Var('annotated')),
                    ),
                  },
                  q.Var('doc'),
                ),
              ),
              action: action(q.Var('ctx'))().log('restore', DocumentRef(q.Var('doc'))),
            },
            q.Var('doc'),
            q.Var('action'),
          );
          // ----
          const offline = `factory.${prefix.toLowerCase()}.validity.restore`;
          const online = { name: BiotaFunctionName(`${prefix}ValidityRestore`), role: null };
          return MethodDispatch({ context, inputs, query })(offline, online);
        },
      },
      annotate(actionName = null, data = {}) {
        const inputs = { actionName, data };
        // ----
        const query = MethodQuery(
          {
            doc: q.If(
              ContextProp(q.Var('ctx'), 'annotateDocuments'),
              q.Let(
                {
                  activity: {
                    insert: { inserted_by: ContextProp(q.Var('ctx'), 'identity'), inserted_at: q.Now() },
                    update: { updated_by: ContextProp(q.Var('ctx'), 'identity'), updated_at: q.Now() },
                    replace: { replaced_by: ContextProp(q.Var('ctx'), 'identity'), replaced_at: q.Now() },
                    delete: { deleted_by: ContextProp(q.Var('ctx'), 'identity'), deleted_at: q.Now() },
                    forget: { forgotten_by: ContextProp(q.Var('ctx'), 'identity'), forgotten_at: q.Now() },
                    restore: { restored_by: ContextProp(q.Var('ctx'), 'identity'), restored_at: q.Now() },
                    remember: { remembered_by: ContextProp(q.Var('ctx'), 'identity'), remembered_at: q.Now() },
                    expire: { expiration_changed_by: ContextProp(q.Var('ctx'), 'identity'), expiration_changed_at: q.Now() },
                    credentials_change: { credentials_changed_by: ContextProp(q.Var('ctx'), 'identity'), credentials_changed_at: q.Now() },
                    auth_email_change: { auth_email_changed_by: ContextProp(q.Var('ctx'), 'identity'), auth_email_changed_at: q.Now() },
                    auth_accounts_change: {
                      auth_accounts_changed_by: ContextProp(q.Var('ctx'), 'identity'),
                      auth_accounts_changed_at: q.Now(),
                    },
                    roles_change: { roles_changed_by: ContextProp(q.Var('ctx'), 'identity'), roles_changed_at: q.Now() },
                    owner_change: { owner_changed_by: ContextProp(q.Var('ctx'), 'identity'), owner_changed_at: q.Now() },
                    assignees_change: { assignees_changed_by: ContextProp(q.Var('ctx'), 'identity'), assignees_changed_at: q.Now() },
                  },
                  _activity: q.Select(q.Var('actionName'), q.Var('activity'), {}),
                  data_activity: q.Select('_activity', q.Var('data'), {}),
                  merged_activity: q.Merge(q.Var('data_activity'), q.Var('_activity')),
                },
                q.If(
                  q.IsObject(q.Var('_activity')),
                  q.Merge(q.Var('data'), { _activity: q.Var('merged_activity') }),
                  ThrowError(q.Var('ctx'), "This action event doesn't exist", { name: q.Var('actionName') }),
                ),
              ),
              q.Var('data'),
            ),
          },
          q.Var('doc'),
        );
        // ----
        const offline = `factory.${prefix.toLowerCase()}.annotate`;
        const online = { name: BiotaFunctionName('DocumentAnnotate'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    };
  };
};
