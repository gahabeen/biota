import { query as q } from 'faunadb';
import { MethodDispatch, Query } from '~/factory/constructors/method';
import { ResultData } from '~/factory/constructors/result';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryRole } from '~/types/factory/factory.role';
import { action } from './action';
import { BiotaFunctionName } from './constructors';
import { document } from './document';


// tslint:disable-next-line: only-arrow-functions
export const role: FactoryContext<FactoryRole> = function (context): FactoryRole {
  // tslint:disable-next-line: only-arrow-functions
  return (name = null) => {
    return {
      get() {
        const inputs = { name };
        // ----
        const query = Query(
          {
            doc: q.Get(q.Role(q.Var('name'))),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.role.get';
        const online = { name: BiotaFunctionName('RoleGet'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      insert(options) {
        const inputs = { name, options };
        // ---
        const query = Query(
          {
            annotated: ResultData(document(q.Var('ctx'))().annotate('insert', q.Select('data', q.Var('options'), {}))),
            doc: q.CreateFunction(q.Merge(q.Var('options'), { name: q.Var('name'), data: q.Var('annotated') })),
            action: action(q.Var('ctx'))('insert', q.Var('doc')).log(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.role.insert';
        const online = { name: BiotaFunctionName('RoleInsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      update(options) {
        const inputs = { name, options };
        // ---
        const query = Query(
          {
            annotated: ResultData(document(q.Var('ctx'))().annotate('update', q.Select('data', q.Var('options'), {}))),
            doc: q.Update(q.Role(q.Var('name')), q.Merge(q.Var('options'), { data: q.Var('annotated') })),
            action: action(q.Var('ctx'))('update', q.Var('doc')).log(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.role.update';
        const online = { name: BiotaFunctionName('RoleUpdate'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      upsert(options) {
        const inputs = { name, options };
        // ---
        const query = Query(
          {
            doc: q.If(
              q.Exists(q.Role(q.Var('name'))),
              ResultData(role(q.Var('ctx'))(q.Var('name')).update(q.Var('options'))),
              ResultData(role(q.Var('ctx'))(q.Var('name')).insert(q.Var('options'))),
            ),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.role.upsert';
        const online = { name: BiotaFunctionName('RoleUpsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      replace(options) {
        const inputs = { name, options };
        // ---
        const query = Query(
          {
            current_doc: ResultData(role(q.Var('ctx'))(q.Var('name')).get()),
            annotated: ResultData(
              document(q.Var('ctx'))().annotate(
                'replace',
                q.Merge(q.Select('data', q.Var('options'), {}), {
                  _auth: q.Select('_auth', q.Var('current_doc'), {}),
                  _membership: q.Select('_membership', q.Var('current_doc'), {}),
                  _validity: q.Select('_validity', q.Var('current_doc'), {}),
                  _activity: q.Select('_activity', q.Var('current_doc'), {}),
                }),
              ),
            ),
            doc: q.Replace(q.Role(q.Var('name')), q.Merge(q.Var('options'), { data: q.Var('annotated') })),
            action: action(q.Var('ctx'))('replace', q.Var('doc')).log(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.role.replace';
        const online = { name: BiotaFunctionName('RoleReplace'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      repsert(options) {
        const inputs = { name, options };
        // ---
        const query = Query(
          {
            doc: q.If(
              q.Exists(q.Role(q.Var('name'))),
              ResultData(role(q.Var('ctx'))(q.Var('name')).replace(q.Var('options'))),
              ResultData(role(q.Var('ctx'))(q.Var('name')).insert(q.Var('options'))),
            ),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.role.repsert';
        const online = { name: BiotaFunctionName('RoleRepsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      delete() {
        const inputs = { name };
        // ---
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Role(q.Var('name'))).validity.delete()),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.role.delete';
        const online = { name: BiotaFunctionName('RoleDelete'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      forget() {
        const inputs = { name };
        // ---
        const query = Query(
          {
            annotated: ResultData(document(q.Var('ctx'))().annotate('forget')),
            annotated_doc: ResultData(role(q.Var('ctx'))(q.Var('name')).upsert(q.Var('annotated'))),
            action: action(q.Var('ctx'))('forget', q.Var('annotated_doc')).log(),
            doc: q.Delete(q.Var('name')),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.role.forget';
        const online = { name: BiotaFunctionName('RoleForget'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      drop() {
        const inputs = { name };
        // ---
        const query = Query(
          {
            doc: q.If(q.Exists(q.Role(q.Var('name'))), role(q.Var('ctx'))(q.Var('name')).forget(), false),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.role.drop';
        const online = { name: BiotaFunctionName('RoleClean'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      membership: {
        distinct(membership) {
          const inputs = { name, membership };
          // ---
          const query = Query(
            {
              membership_resource: q.Select('resource', q.Var('membership')),
              current_membership_raw: q.Select('membership', q.Get(q.Role(q.Var('name'))), []),
              current_membership: q.If(
                q.IsObject(q.Var('current_membership_raw')),
                [q.Var('current_membership_raw')],
                q.Var('current_membership_raw'),
              ),
              same_current_membership: q.Filter(
                q.Var('current_membership'),
                q.Lambda('cm', q.Equals(q.Select('resource', q.Var('cm')), q.Var('membership_resource'))),
              ),
              current_membership_except_new: q.Filter(
                q.Var('current_membership'),
                q.Lambda('cm', q.Not(q.Equals(q.Select('resource', q.Var('cm')), q.Var('membership_resource')))),
              ),
              new_membership: q.Merge(q.Select(0, q.Var('same_current_membership'), {}), q.Var('membership')),
              new_memberships: q.Append(q.Var('current_membership_except_new'), [q.Var('new_membership')]),
            },
            q.Var('new_memberships'),
          );
          // ---
          const offline = 'factory.role.membership.distinct';
          const online = { name: BiotaFunctionName('RoleMembershipDistinct'), role: null };
          return MethodDispatch({ context, inputs, query })(offline, online);
        },
        difference(resource) {
          const inputs = { name, resource };
          // ---
          const query = Query(
            {
              current_membership_raw: q.Select('membership', q.Get(q.Role(q.Var('name'))), []),
              current_membership: q.If(
                q.IsObject(q.Var('current_membership_raw')),
                [q.Var('current_membership_raw')],
                q.Var('current_membership_raw'),
              ),
              membership_filtered: q.Filter(
                q.Var('current_membership'),
                q.Lambda('cm', q.Not(q.Equals(q.Select('resource', q.Var('cm')), q.Var('resource')))),
              ),
            },
            q.Var('membership_filtered'),
          );
          // ---
          const offline = 'factory.role.membership.difference';
          const online = { name: BiotaFunctionName('RoleMembershipDifference'), role: null };
          return MethodDispatch({ context, inputs, query })(offline, online);
        },
        set(membership) {
          const inputs = { name, membership };
          // ---
          const query = Query(
            {
              doc: ResultData(
                role(q.Var('ctx'))(q.Var('name')).upsert({
                  membership: ResultData(role(q.Var('ctx'))(q.Var('name')).membership.distinct(q.Var('membership'))),
                }),
              ),
            },
            q.Var('doc'),
          );
          // ---
          const offline = 'factory.role.membership.set';
          const online = { name: BiotaFunctionName('RoleMembershipSet'), role: null };
          return MethodDispatch({ context, inputs, query })(offline, online);
        },
        setMany(membershipList) {
          const inputs = { name, membershipList };
          // ---
          const query = Query(
            {
              iterations: q.Map(
                q.Var('membershipList'),
                q.Lambda(
                  ['membership'],
                  ResultData(
                    role(q.Var('ctx'))(q.Var('name')).upsert({
                      membership: ResultData(role(q.Var('ctx'))(q.Var('name')).membership.distinct(q.Var('membership'))),
                    }),
                  ),
                ),
              ),
              doc: q.Select(q.Subtract(q.Count(q.Var('iterations')), 1), q.Var('iterations'), null),
            },
            q.Var('doc'),
          );
          // ---
          const offline = 'factory.role.membership.setMany';
          const online = { name: BiotaFunctionName('RoleMembershipSetMany'), role: null };
          return MethodDispatch({ context, inputs, query })(offline, online);
        },
        remove(resource) {
          const inputs = { name, resource };
          // ---
          const query = Query(
            {
              doc: ResultData(
                role(q.Var('ctx'))(q.Var('name')).upsert({
                  membership: ResultData(role(q.Var('ctx'))(q.Var('name')).membership.difference(q.Var('resource'))),
                }),
              ),
            },
            q.Var('doc'),
          );
          // ---
          const offline = 'factory.role.membership.remove';
          const online = { name: BiotaFunctionName('RoleMembershipRemove'), role: null };
          return MethodDispatch({ context, inputs, query })(offline, online);
        },
        removeMany(resourceList) {
          const inputs = { name, resourceList };
          // ---
          const query = Query(
            {
              iterations: q.Map(
                q.Var('resourceList'),
                q.Lambda(
                  ['resource'],
                  ResultData(
                    role(q.Var('ctx'))(q.Var('name')).upsert({
                      membership: ResultData(role(q.Var('ctx'))(q.Var('name')).membership.difference(q.Var('resource'))),
                    }),
                  ),
                ),
              ),
              doc: q.Select(q.Subtract(q.Count(q.Var('iterations')), 1), q.Var('iterations'), null),
            },
            q.Var('doc'),
          );
          // ---
          const offline = 'factory.role.membership.removeMany';
          const online = { name: BiotaFunctionName('RoleMembershipRemoveMany'), role: null };
          return MethodDispatch({ context, inputs, query })(offline, online);
        },
      },
      privilege: {
        distinct(privilege) {
          const inputs = { name, privilege };
          // ---
          const query = Query(
            {
              privilege_resource: q.Select('resource', q.Var('privilege')),
              has_privilege_resource: q.If(q.IsRef(q.Var('privilege_resource')), true, q.Abort("Privilege doesn't have a resource")),
              current_privilege_raw: q.Select('privileges', q.Get(q.Role(q.Var('name'))), []),
              current_privilege: q.If(
                q.IsObject(q.Var('current_privilege_raw')),
                [q.Var('current_privilege_raw')],
                q.Var('current_privilege_raw'),
              ),
              same_current_privilege: q.Filter(
                q.Var('current_privilege'),
                q.Lambda('cm', q.Equals(q.Select('resource', q.Var('cm')), q.Var('privilege_resource'))),
              ),
              current_privilege_except_new: q.Filter(
                q.Var('current_privilege'),
                q.Lambda('cm', q.Not(q.Equals(q.Select('resource', q.Var('cm')), q.Var('privilege_resource')))),
              ),
              new_privilege_actions: q.Merge(
                q.Select([0, 'actions'], q.Var('same_current_privilege'), {}),
                q.Select('actions', q.Var('privilege'), {}),
              ),
              new_privileges: q.Append(q.Var('current_privilege_except_new'), [
                {
                  resource: q.Select('resource', q.Var('privilege')),
                  actions: q.Var('new_privilege_actions'),
                },
              ]),
            },
            q.Var('new_privileges'),
          );
          // ---
          const offline = 'factory.role.privilege.distinct';
          const online = { name: BiotaFunctionName('RolePrivilegeDistinct'), role: null };
          return MethodDispatch({ context, inputs, query })(offline, online);
        },
        difference(resource) {
          const inputs = { name, resource };
          // ---
          const query = Query(
            {
              current_privileges_raw: q.Select('privileges', q.Get(q.Role(q.Var('name'))), []),
              current_privileges: q.If(
                q.IsObject(q.Var('current_privileges_raw')),
                [q.Var('current_privileges_raw')],
                q.Var('current_privileges_raw'),
              ),
              privileges_filtered: q.Filter(
                q.Var('current_privileges'),
                q.Lambda('cm', q.Not(q.Equals(q.Select('resource', q.Var('cm')), q.Var('resource')))),
              ),
            },
            q.Var('privileges_filtered'),
          );
          // ---
          const offline = 'factory.role.privilege.difference';
          const online = { name: BiotaFunctionName('RolePrivilegeDifference'), role: null };
          return MethodDispatch({ context, inputs, query })(offline, online);
        },
        set(privilege) {
          const inputs = { name, privilege };
          // ---
          const query = Query(
            {
              doc: ResultData(
                role(q.Var('ctx'))(q.Var('name')).upsert({
                  privileges: ResultData(role(q.Var('ctx'))(q.Var('name')).privilege.distinct(q.Var('privilege'))),
                }),
              ),
            },
            q.Var('doc'),
          );
          // ---
          const offline = 'factory.role.privilege.set';
          const online = { name: BiotaFunctionName('RolePrivilegesSet'), role: null };
          return MethodDispatch({ context, inputs, query })(offline, online);
        },
        setMany(privilegeList) {
          const inputs = { name, privilegeList };
          // ---
          const query = Query(
            {
              iterations: q.Map(
                q.Var('privilegeList'),
                q.Lambda(
                  ['privilege'],
                  ResultData(
                    role(q.Var('ctx'))(q.Var('name')).upsert({
                      privileges: ResultData(role(q.Var('ctx'))(q.Var('name')).privilege.distinct(q.Var('privilege'))),
                    }),
                  ),
                ),
              ),
              doc: q.Select(q.Subtract(q.Count(q.Var('iterations')), 1), q.Var('iterations'), null),
            },
            q.Var('doc'),
          );
          // ---
          const offline = 'factory.role.privilege.setMany';
          const online = { name: BiotaFunctionName('RolePrivilegesSetMany'), role: null };
          return MethodDispatch({ context, inputs, query })(offline, online);
        },
        scaffold(privilege) {
          const inputs = { name, privilege };
          // ---
          const query = Query(
            {
              doc: ResultData(
                role(q.Var('ctx'))(q.Var('name')).upsert({
                  privileges: ResultData(role(q.Var('ctx'))(q.Var('name')).privilege.distinct(q.Var('privilege'))),
                }),
              ),
            },
            q.Var('doc'),
          );
          // ---
          const offline = 'factory.role.privilege.set';
          const online = { name: BiotaFunctionName('RolePrivilegesSet'), role: null };
          return MethodDispatch({ context, inputs, query })(offline, online);
        },
        remove(resource) {
          const inputs = { name, resource };
          // ---
          const query = Query(
            {
              doc: ResultData(
                role(q.Var('ctx'))(q.Var('name')).upsert({
                  privileges: ResultData(role(q.Var('ctx'))(q.Var('name')).privilege.difference(q.Var('resource'))),
                }),
              ),
            },
            q.Var('doc'),
          );
          // ---
          const offline = 'factory.role.privilege.remove';
          const online = { name: BiotaFunctionName('RolePrivilegesRemove'), role: null };
          return MethodDispatch({ context, inputs, query })(offline, online);
        },
        removeMany(resourceList) {
          const inputs = { name, resourceList };
          // ---
          const query = Query(
            {
              iterations: q.Map(
                q.Var('resourceList'),
                q.Lambda(
                  ['resource'],
                  ResultData(
                    role(q.Var('ctx'))(q.Var('name')).upsert({
                      privileges: ResultData(role(q.Var('ctx'))(q.Var('name')).privilege.difference(q.Var('resource'))),
                    }),
                  ),
                ),
              ),
              doc: q.Select(q.Subtract(q.Count(q.Var('iterations')), 1), q.Var('iterations'), null),
            },
            q.Var('doc'),
          );
          // ---
          const offline = 'factory.role.privilege.removeMany';
          const online = { name: BiotaFunctionName('RolePrivilegesRemoveMany'), role: null };
          return MethodDispatch({ context, inputs, query })(offline, online);
        },
      },
      expireAt(at) {
        // alias
        const inputs = { name, at };
        // ----
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Role(q.Var('name'))).validity.expire(q.Var('at'))),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.role.expireAt';
        const online = { name: BiotaFunctionName('RoleExpireAt'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireIn(delay) {
        // alias
        const inputs = { name, delay };
        // ----
        const query = Query(
          {
            doc: ResultData(
              document(q.Var('ctx'))(q.Role(q.Var('name'))).validity.expire(q.TimeAdd(q.Now(), q.ToNumber(q.Var('delay')), 'milliseconds')),
            ),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.role.expireIn';
        const online = { name: BiotaFunctionName('RoleExpireIn'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireNow() {
        // alias
        const inputs = { name };
        // ----
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Role(q.Var('name'))).validity.expire(q.Now())),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.role.expireNow';
        const online = { name: BiotaFunctionName('RoleExpireNow'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      restore() {
        // alias
        const inputs = { name };
        // ----
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Role(q.Var('name'))).validity.restore()),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.collection.restore';
        const online = { name: BiotaFunctionName('RoleRestore'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    };
  };
};
