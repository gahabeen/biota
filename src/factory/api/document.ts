import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryDocument } from '~/../types/factory/factory.document';
import { TS_2500_YEARS } from '~/consts';
import * as helpers from '~/helpers';
import { ContextProp, ContextExtend } from '../constructors/context';
import { Result, ResultData } from '../constructors/result';
import { CallFunction, BiotaFunctionName } from '../constructors/udfunction';
import { action } from '~/factory/api/action';
import { ThrowError } from '../constructors/error';
import { Query, MethodDispatch } from '../constructors/method';

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
        const query = Query(
          {
            doc: q.Get(q.Var('ref')),
          },
          q.Var('doc'),
        );
        const offline = 'factory.document.get';
        const online = { name: BiotaFunctionName('DocumentGet'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      insert(data) {
        const inputs = { name, data };
        const query = Query(
          {
            doc: q.Create(q.Var('ref'), { data: q.Var('data') }),
            action: action(q.Var('ctx'))('insert', q.Var('doc')).dispatch(),
          },
          q.Select('doc', q.Var('action'), q.Var('doc')),
          q.Var('action'),
        );
        const offline = 'factory.document.insert';
        const online = { name: BiotaFunctionName('DocumentInsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      update(data) {
        const inputs = { ref, data };
        const query = Query(
          {
            doc: q.Update(q.Var('ref'), { data: q.Var('data') }),
            action: action(q.Var('ctx'))('update', q.Var('doc')).dispatch(),
          },
          q.Select('doc', q.Var('action'), q.Var('doc')),
          q.Var('action'),
        );
        const offline = 'factory.document.update';
        const online = { name: BiotaFunctionName('DocumentUpdate'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      upsert(data) {
        const inputs = { ref, data };
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
        const offline = 'factory.document.upsert';
        const online = { name: BiotaFunctionName('DocumentUpsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      replace(data) {
        const inputs = { ref, data };
        const query = Query(
          {
            doc: q.Replace(q.Var('ref'), { data: q.Var('data') }),
            action: action(q.Var('ctx'))('replace', q.Var('doc')).dispatch(),
          },
          q.Select('doc', q.Var('action'), q.Var('doc')),
          q.Var('action'),
        );
        const offline = 'factory.document.replace';
        const online = { name: BiotaFunctionName('DocumentReplace'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      repsert(data) {
        const inputs = { ref, data };
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
        const offline = 'factory.document.repsert';
        const online = { name: BiotaFunctionName('DocumentRepsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      delete() {
        const inputs = { ref };
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).validity.delete()),
            action: action(q.Var('ctx'))('delete', q.Var('doc')).dispatch(),
          },
          q.Select('doc', q.Var('action'), q.Var('doc')),
          q.Var('action'),
        );
        const offline = 'factory.document.delete';
        const online = { name: BiotaFunctionName('DocumentDelete'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      restore() {
        const inputs = { ref };
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).validity.restore()),
          },
          q.Var('doc'),
        );
        const offline = 'factory.document.restore';
        const online = { name: BiotaFunctionName('DocumentRestore'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      forget() {
        const inputs = { ref };
        const query = Query(
          {
            action: action(q.Var('ctx'))('forget', ref).dispatch(),
            doc: q.Delete(q.Var('ref')),
          },
          q.Var('doc'),
        );
        const offline = 'factory.document.forget';
        const online = { name: BiotaFunctionName('DocumentRestore'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      clean() {
        const inputs = { ref };
        const query = Query(
          {
            doc: q.If(q.Exists(q.Var('ref')), document(q.Var('ctx'))(q.Var('ref')).forget(), false),
            // already logging actions: forget
          },
          q.Var('doc'),
        );
        const offline = 'factory.document.clean';
        const online = { name: BiotaFunctionName('DocumentClean'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireAt(at) {
        const inputs = { ref, at };
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).validity.expire(q.Var('at'))),
          },
          q.Var('doc'),
          // already logged
        );
        const offline = 'factory.document.expireAt';
        const online = { name: BiotaFunctionName('DocumentExpireAt'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireIn(delay) {
        const inputs = { ref, delay };
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).validity.expire(q.TimeAdd(q.Now(), q.ToNumber(delay), 'milliseconds'))),
          },
          q.Var('doc'),
          // already logged
        );
        const offline = 'factory.document.expireIn';
        const online = { name: BiotaFunctionName('DocumentExpireIn'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireNow() {
        const inputs = { ref };
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).validity.expire(q.Now())),
          },
          q.Var('doc'),
          // already logged
        );
        const offline = 'factory.document.expireNow';
        const online = { name: BiotaFunctionName('DocumentExpireNow'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },

      membership: {
        role(roleOrRef) {
          const roleRef = q.If(q.IsRole(roleOrRef), roleOrRef, q.Role(roleOrRef));
          return {
            distinct() {
              const ctx = ContextExtend(context, 'factory.document.membership.role.distinct');
              return q.If(
                offline,
                q.Let(
                  {
                    doc: q.Distinct(q.Union(q.Select(helpers.path('_membership.roles'), q.Get(q.Var('ref')), []), [roleRef])),
                    // nothing to log
                  },
                  Result(ctx, q.Var('doc')),
                ),
                CallFunction('DocumentMembershipRoleDistinct', context, { ref, roleRef }),
              );
            },
            difference() {
              const ctx = ContextExtend(context, 'factory.document.membership.role.difference');
              return q.If(
                offline,
                q.Let(
                  {
                    doc: q.Difference(q.Select(helpers.path('_membership.roles'), q.Get(q.Var('ref')), []), [roleRef]),
                    // nothing to log
                  },
                  Result(ctx, q.Var('doc')),
                ),
                CallFunction('DocumentMembershipRoleDifference', context, { ref, roleRef }),
              );
            },
            set() {
              const ctx = ContextExtend(context, 'factory.document.membership.role.set');
              return q.If(
                offline,
                q.Let(
                  {
                    doc: document(q.Var('ctx'))(q.Var('ref')).upsert({
                      _membership: {
                        roles: ResultData(document(q.Var('ctx'))(q.Var('ref')).membership.role(roleRef).distinct()),
                      },
                    }),
                  },
                  Result(ctx, q.Var('doc')),
                ),
                CallFunction('DocumentMembershipRoleSet', context, { ref, roleRef }),
              );
            },
            remove() {
              const ctx = ContextExtend(context, 'factory.document.membership.role.remove');
              return q.If(
                offline,
                q.Let(
                  {
                    doc: document(q.Var('ctx'))(q.Var('ref')).upsert({
                      _membership: {
                        roles: ResultData(document(q.Var('ctx'))(q.Var('ref')).membership.role(roleRef).difference()),
                      },
                    }),
                  },
                  Result(ctx, q.Var('doc')),
                ),
                CallFunction('DocumentMembershipRoleRemove', context, { ref, roleRef }),
              );
            },
          };
        },
        owner: {
          // tslint:disable-next-line: no-shadowed-variable
          set(user) {
            const ctx = ContextExtend(context, 'factory.document.membership.owner.set');
            return q.If(
              offline,
              q.Let(
                {
                  doc: q.If(
                    q.IsDoc(user),
                    ResultData(
                      document(q.Var('ctx'))(q.Var('ref')).upsert({
                        _membership: {
                          owner: user,
                        },
                      }),
                    ),
                    ThrowError(ctx, "User isn't a document reference", { user }),
                  ),
                },
                Result(ctx, q.Var('doc')),
              ),
              CallFunction('DocumentMembershipOwnerSet', context, { ref, user }),
            );
          },
          remove() {
            const ctx = ContextExtend(context, 'factory.document.membership.owner.remove');
            return q.If(
              offline,
              q.Let(
                {
                  doc: ResultData(
                    document(q.Var('ctx'))(q.Var('ref')).upsert({
                      _membership: {
                        owner: null,
                      },
                    }),
                  ),
                },
                Result(ctx, q.Var('doc')),
              ),
              CallFunction('DocumentMembershipOwnerRemove', context, { ref }),
            );
          },
        },
        assignee(assignee) {
          const assigneeRef = q.If(q.IsDoc(assignee), assignee, null);
          return {
            distinct() {
              const ctx = ContextExtend(context, 'factory.document.membership.assignee.distinct');
              return q.If(
                offline,
                q.Let(
                  {
                    doc: q.Distinct(q.Union(q.Select(helpers.path('_membership.assignees'), q.Get(q.Var('ref')), []), [assigneeRef])),
                    // don't need logging
                  },
                  Result(ctx, q.Var('doc')),
                ),
                CallFunction('DocumentMembershipAssigneeDistinct', context, { ref, assigneeRef }),
              );
            },
            difference() {
              const ctx = ContextExtend(context, 'factory.document.membership.assignee.difference');
              return q.If(
                offline,
                q.Let(
                  {
                    doc: q.Difference(q.Select(helpers.path('_membership.assignees'), q.Get(q.Var('ref')), []), [assigneeRef]),
                    // don't need logging
                  },
                  Result(ctx, q.Var('doc')),
                ),
                CallFunction('DocumentMembershipAssigneeDifference', context, { ref, assigneeRef }),
              );
            },
            set() {
              const ctx = ContextExtend(context, 'factory.document.membership.assignee.set');
              return q.If(
                offline,
                q.Let(
                  {
                    doc: ResultData(
                      document(q.Var('ctx'))(q.Var('ref')).upsert({
                        _membership: {
                          assignees: document(q.Var('ctx'))(q.Var('ref')).membership.role(assigneeRef).distinct(),
                        },
                      }),
                    ),
                    // already logging actions: update/insert in upsert
                  },
                  Result(ctx, q.Var('doc')),
                ),
                CallFunction('DocumentMembershipAssigneeSet', context, { ref, assigneeRef }),
              );
            },
            remove() {
              const ctx = ContextExtend(context, 'factory.document.membership.assignee.remove');
              return q.If(
                offline,
                q.Let(
                  {
                    doc: ResultData(
                      document(q.Var('ctx'))(q.Var('ref')).upsert({
                        _membership: {
                          assignees: document(q.Var('ctx'))(q.Var('ref')).membership.role(assigneeRef).difference(),
                        },
                      }),
                    ),
                    // already logging actions: update/insert in upsert
                  },
                  Result(ctx, q.Var('doc')),
                ),
                CallFunction('DocumentMembershipAssigneeRemove', context, { ref, assigneeRef }),
              );
            },
          };
        },
      },
      validity: {
        delete() {
          const ctx = ContextExtend(context, 'factory.document.validity.delete');
          return q.If(
            offline,
            q.Let(
              {
                doc: ResultData(
                  document(q.Var('ctx'))(q.Var('ref')).upsert({
                    _validity: {
                      deleted: true,
                    },
                  }),
                ),
                // already logging actions: update/insert in upsert
              },
              Result(ctx, q.Var('doc')),
            ),
            CallFunction('DocumentValidityDelete', context, { ref }),
          );
        },
        expire(at) {
          const ctx = ContextExtend(context, 'factory.document.validity.expire');
          return q.If(
            offline,
            q.Let(
              {
                doc: q.If(
                  q.IsTimestamp(at),
                  ResultData(
                    document(q.Var('ctx'))(q.Var('ref')).upsert({
                      _validity: {
                        expires_at: at,
                      },
                    }),
                  ),
                  ThrowError(ctx, "[at] isn't a valid time", { at }),
                ),
                action: action(q.Var('ctx'))('expire', q.Var('doc')).dispatch(),
              },
              Result(ctx, q.Var('doc')),
            ),
            CallFunction('DocumentValidityExpire', context, { ref, at }),
          );
        },
        restore() {
          const ctx = ContextExtend(context, 'factory.document.validity.restore');
          return q.If(
            offline,
            q.Let(
              {
                doc: q.Let(
                  {
                    doc: q.Get(q.Var('ref')),
                    isDeleted: q.Select(helpers.path('_validity.deleted'), q.Var('doc'), false),
                    isExpired: q.GTE(q.Select(helpers.path('_validity.expires_at'), q.Var('doc'), q.ToTime(TS_2500_YEARS)), q.Now()),
                  },
                  q.Do(
                    q.If(
                      q.Var('isDeleted'),
                      ResultData(
                        document(q.Var('ctx'))(q.Var('ref')).upsert({
                          _validity: {
                            deleted: false,
                          },
                        }),
                      ),
                      false,
                    ),
                    q.If(
                      q.Var('isExpired'),
                      ResultData(
                        document(q.Var('ctx'))(q.Var('ref')).upsert({
                          _validity: {
                            expires_at: null,
                          },
                        }),
                      ),
                      false,
                    ),
                  ),
                ),
                action: action(q.Var('ctx'))('restore', q.Var('doc')).dispatch(),
              },
              Result(ctx, q.Var('doc')),
            ),
            CallFunction('DocumentValidityRestore', context, { ref }),
          );
        },
      },
    };
  };
};
